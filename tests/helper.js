/* eslint-disable import/no-extraneous-dependencies */
import dotenv from 'dotenv';
import nock from 'nock';
import db from '../db';
import artistData from './data/v1/artists/foo.json';
import artistAlbumsData from './data/v1/artists/foo/albums.json';
import artistManyAlbumsData from './data/v1/artists/foo-many-albums/albums.json';
import albumData from './data/v1/albums/foo.json';
import albumSearchData from './data/v1/albums/search.json';
import meData from './data/v1/me.json';
import mePlaylistsData from './data/v1/me/playlists.json';
import playlistData from './data/v1/playlists/foo.json';

dotenv.config();

export function mockSpotify() {
  const accounts = nock('https://accounts.spotify.com');

  accounts.get(/^\/authorize(\?.*)?/)
    .reply(200, '{}');

  accounts.post('/api/token')
    .reply((_, requestBody) => {
      let body;

      if (requestBody.indexOf('&code=invalid') > -1) {
        body = {
          error: 'invalid_grant',
          error_description: 'Invalid authorization code',
        };
        return [400, body];
      }

      if (requestBody.indexOf('&code=valid_code') > -1) {
        body = {
          access_token: 'new_access_token',
          token_type: 'Bearer',
          scope: 'user-read-private user-read-email',
          expires_in: 3600,
          refresh_token: 'new_refresh_token',
        };
        return [200, body];
      }

      body = {
        access_token: 'new_access_token',
        token_type: 'Bearer',
        expires_in: 3600,
        scope: 'user-read-private user-read-email',
      };
      return [200, body];
    });

  const api = nock('https://api.spotify.com')
    .matchHeader('authorization', 'Bearer existing_access_token')
    .persist();

  api.get(/^\/v1\/albums\/\w+/)
    .reply(() => [200, albumData]);

  api.get(/^\/v1\/albums\?.+/)
    .reply(() => [200, albumSearchData]);

  api.get(/^\/v1\/artists\/foo-many-albums\/albums/)
    .reply(() => [200, artistManyAlbumsData]);

  api.get(/^\/v1\/artists\/foo\/albums/)
    .reply(() => [200, artistAlbumsData]);

  api.get(/^\/v1\/artists\/\w+/)
    .reply(() => [200, artistData]);

  api.get('/v1/me/playlists')
    .reply(() => [200, mePlaylistsData]);

  api.get('/v1/me')
    .reply(() => [200, meData]);

  api.get(/^\/v1\/playlists\/\w+/)
    .reply(() => [200, playlistData]);

  nock('https://api.spotify.com')
    .persist()
    .get(/.+/)
    .reply(() => (
      [
        401,
        {
          error: {
            status: 401,
            message: 'The access token expired',
          },
        },
      ]
    ));
}

export function mockDatabase() {
  return db.migrate.rollback()
    .then(() => db.migrate.latest())
    .then(() => db.seed.run());
}

export function mockDestroyDatabase() {
  return db.destroy();
}
