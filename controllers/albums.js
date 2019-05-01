import Spotify from '../utilities/spotify';
import spotifyClient from '../spotify-client';
import { sendError, sendSuccess } from '../utilities/response';

/**
 * @description Returns data about a single album.
 * @param {Object} req
 * @param {Object} res
 * @returns {Promise}
 */
exports.show = (req, res) => (
  Spotify.authenticate(req)
    .then(() => spotifyClient.getAlbum(req.params.id))
    .then(response => sendSuccess(res, response.body))
    .catch(response => sendError(res, response))
);
