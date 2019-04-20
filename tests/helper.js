import dotenv from 'dotenv';
import nock from 'nock'; // eslint-disable-line import/no-extraneous-dependencies
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
      if (requestBody.indexOf('&code=invalid&') > -1) {
        body = {
          error: 'invalid_grant',
          error_description: 'Invalid authorization code',
        };
        return [400, body];
      }

      body = {
        access_token: 'example_access_token',
        token_type: 'Bearer',
        scope: 'user-read-private user-read-email',
        expires_in: 3600,
        refresh_token: 'example_refresh_token',
      };
      return [200, body];
    });
}

export function mockDatabase() {
  return db.migrate.rollback()
    .then(() => db.migrate.latest());
}
