import crypto from 'crypto';
import dotenv from 'dotenv';
import { getSessionData } from '../utilities/authentication';
import { sendError } from '../utilities/response';
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
 */
exports.callback = (req, res) => {
  if (!req.query.state) {
    sendError(res, 'Missing state parameter.', 401);
    return;
  }

  if (!req.query.code) {
    sendError(res, 'Missing code parameter.', 401);
    return;
  }

  if (!req.cookies.state) {
    sendError(res, 'Missing state cookie.', 401);
    return;
  }

  if (req.cookies.state !== req.query.state) {
    sendError(res, 'Invalid state.', 401);
    return;
  }

  spotifyClient.authorizationCodeGrant(req.query.code)
    .then((response) => {
      const session = getSessionData(response.body);
      Session.add(session)
        .then(() => {
          const url = `${process.env.MENDREK_APP_URL}/?token=${encodeURIComponent(session.access_token)}`;
          res.redirect(url);
        });
    })
    .catch(() => sendError(res, 'Invalid code.', 401));
};
