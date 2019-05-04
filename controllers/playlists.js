import { csv, json } from '../utilities/file';
import Spotify from '../utilities/spotify';
import spotifyClient from '../spotify-client';
import { sendError, sendFile, sendSuccess } from '../utilities/response';

/**
 * @description Returns data about a single playlist.
 * @param {Object} req
 * @param {Object} res
 * @returns {Promise}
 */
exports.show = (req, res) => (
  Spotify.authenticate(req)
    .then(() => spotifyClient.getPlaylist(req.params.id))
    .then(response => sendSuccess(res, response.body))
    .catch(response => sendError(res, response))
);

/**
 * @description Exports a playlist to CSV.
 * @param {Object} req
 * @param {Object} res
 * @returns {Promise}
 */
exports.csv = (req, res) => (
  Spotify.authenticate(req)
    .then(() => spotifyClient.getPlaylist(req.params.id))
    .then((response) => {
      const filename = `mendrek-playlist-${req.params.id}.csv`;
      return sendFile(res, filename, csv(response));
    })
    .catch(response => sendError(res, response))
);

/**
 * @description Exports a playlist to JSON.
 * @param {Object} req
 * @param {Object} res
 * @returns {Promise}
 */
exports.json = (req, res) => (
  Spotify.authenticate(req)
    .then(() => spotifyClient.getPlaylist(req.params.id))
    .then((response) => {
      const filename = `mendrek-playlist-${req.params.id}.json`;
      return sendFile(res, filename, json(response));
    })
    .catch(response => sendError(res, response))
);
