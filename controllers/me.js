import Spotify from '../utilities/spotify';
import spotifyClient from '../spotify-client';
import { sendError, sendSuccess } from '../utilities/response';

/**
 * @description Returns info about the current user.
 * @param {Object} req
 * @param {Object} res
 * @returns {Promise}
 */
exports.index = (req, res) => (
  Spotify.authenticate(req)
    .then(() => spotifyClient.getMe())
    .then(response => sendSuccess(res, response.body))
    .catch(response => sendError(res, response))
);

/**
 * @description Returns info about the current user's playlists.
 * @param {Object} req
 * @param {Object} res
 * @returns {Promise}
 */
exports.playlists = (req, res) => (
  Spotify.authenticate(req)
    .then(() => spotifyClient.getUserPlaylists())
    .then(response => sendSuccess(res, response.body))
    .catch(response => sendError(res, response))
);
