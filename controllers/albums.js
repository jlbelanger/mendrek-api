import Spotify from '../utilities/spotify';
import spotifyClient from '../spotify-client';
import { formatAlbum } from '../utilities/format';
import { sendError, sendSuccess } from '../utilities/response';

/**
 * Returns data about a single album.
 * @param {object} req
 * @param {object} res
 * @returns {Promise}
 */
exports.show = (req, res) => (
	Spotify.authenticate(req)
		.then(() => spotifyClient.getAlbum(req.params.id))
		.then((response) => sendSuccess(res, formatAlbum(response.body, true)))
		.catch((response) => sendError(res, response))
);
