/* eslint-disable import/no-extraneous-dependencies */
import dotenv from 'dotenv';
import nock from 'nock';
import db from '../db';

dotenv.config();

export function mockApp() {
  nock(process.env.MENDREK_APP_URL)
    .get(/^\/(\?.*)?/)
    .reply(200, '<html><head></head><body>Hello!</body></html>');
}

export function mockSpotify() {
  nock('https://accounts.spotify.com')
    .get(/^\/authorize(\?.*)?/)
    .reply(200, '{}');

  nock('https://accounts.spotify.com')
    .post('/api/token')
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

  nock('https://api.spotify.com',
    {
      reqheaders: {
        authorization: 'Bearer invalid',
      },
    })
    .get(/.+/)
    .reply(() => [401, { error: { status: 401, message: 'The access token expired' } }]);

  nock('https://api.spotify.com',
    {
      reqheaders: {
        authorization: 'Bearer existing_access_token',
      },
    })
    .get(/.+/)
    .reply(() => [200, {}]);
}

export function mockDatabase() {
  return db.migrate.rollback()
    .then(() => db.migrate.latest())
    .then(() => db.seed.run());
}

export function mockDestroyDatabase() {
  return db.destroy();
}
