import Spotify from '../utilities/spotify';
import spotifyClient from '../spotify-client';
import { formatPlaylists, formatUser } from '../utilities/format';
import { sendError, sendSuccess } from '../utilities/response';

/**
 * Returns info about the current user.
 * @param {object} req
 * @param {object} res
 * @returns {Promise}
 */
exports.index = (req, res) => (
	Spotify.authenticate(req)
		.then(() => spotifyClient.getMe())
		.then((response) => sendSuccess(res, formatUser(response.body)))
		.catch((response) => sendError(res, response))
);

/**
 * Returns info about the current user's playlists.
 * @param {object} req
 * @param {object} res
 * @returns {Promise}
 */
exports.playlists = (req, res) => (
	Spotify.authenticate(req)
		.then(() => spotifyClient.getUserPlaylists())
		.then((response) => sendSuccess(res, formatPlaylists(response.body)))
		.catch((response) => sendError(res, response))
);
