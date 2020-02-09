import crypto from 'crypto';
import dotenv from 'dotenv';
import { getSessionData, getToken } from '../utilities/authentication';
import { sendError, sendSuccess } from '../utilities/response';
import Session from '../models/session';
import spotifyClient from '../spotify-client';

dotenv.config();

/**
 * @description Initiates Spotify authentication.
 * @param {Object} req
 * @param {Object} res
 */
exports.index = (req, res) => {
  const state = crypto.randomBytes(20).toString('hex');
  res.cookie('state', state);

  const scopes = ['playlist-read-private'];
  const url = spotifyClient.createAuthorizeURL(scopes, state);
  res.redirect(url);
};

/**
 * @description Handles Spotify authentication response.
 * @param {Object} req
 * @param {Object} res
 * @returns {Promise}
 */
exports.callback = (req, res) => {
  if (!req.query.state) {
    return sendError(res, 'Missing state parameter.', 401);
  }

  if (!req.query.code) {
    return sendError(res, 'Missing code parameter.', 401);
  }

  if (!req.cookies.state) {
    return sendError(res, 'Missing state cookie.', 401);
  }

  if (req.cookies.state !== req.query.state) {
    return sendError(res, 'Invalid state.', 401);
  }

  return spotifyClient.authorizationCodeGrant(req.query.code)
    .then((response) => {
      const session = getSessionData(response.body);
      return Session.add(session)
        .then(() => {
          const url = `${process.env.MENDREK_APP_URL}/?token=${encodeURIComponent(session.access_token)}&expires=${encodeURIComponent(session.expires)}`;
          res.redirect(url);
        });
    })
    .catch(() => sendError(res, 'Invalid code.', 401));
};

/**
 * @description Deletes the access token.
 * @param {Object} req
 * @param {Object} res
 * @returns {Promise}
 */
exports.logout = (req, res) => {
  const accessToken = getToken(req);
  return Promise.resolve()
    .then(() => {
      if (!accessToken) {
        throw new Error('No authentication token.');
      }
      return Session.get(accessToken);
    })
    .then(() => (
      Session.delete(accessToken)
        .then((results) => {
          if (!results || results.length <= 0) {
            throw new Error('Invalid authentication token.');
          }

          sendSuccess(res, 'Logged out.');
        })
    ))
    .catch(err => sendError(res, err.message, 401));
};

/**
 * @description Refreshes the access token.
 * @param {Object} req
 * @param {Object} res
 * @returns {Promise}
 */
exports.refresh = (req, res) => {
  const oldAccessToken = getToken(req);
  return Promise.resolve()
    .then(() => {
      if (!oldAccessToken) {
        throw new Error('No authentication token.');
      }
      return Session.get(oldAccessToken);
    })
    .then((results) => {
      if (!results || results.length <= 0) {
        throw new Error('Invalid authentication token.');
      }

      spotifyClient.setAccessToken(results[0].access_token);
      spotifyClient.setRefreshToken(results[0].refresh_token);

      return spotifyClient.refreshAccessToken();
    })
    .then((response) => {
      const newSession = getSessionData(response.body);
      return Promise.all([newSession, Session.update(oldAccessToken, newSession)]);
    })
    .then(([newSession]) => sendSuccess(res, newSession))
    .catch(err => sendError(res, err.message, 401));
};
