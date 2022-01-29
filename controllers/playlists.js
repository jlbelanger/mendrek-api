import Spotify from '../utilities/spotify';
import spotifyClient from '../spotify-client';
import { csv, json } from '../utilities/file';
import { formatPlaylist } from '../utilities/format';
import { sendError, sendFile, sendSuccess } from '../utilities/response';

const getAllPlaylistTracks = (id, response, output) => {
	output.playlist = response.body;
	output.tracks = response.body.tracks.items;
	if (response.body.tracks.total > response.body.tracks.limit) {
		const promises = [];
		for (let i = response.body.tracks.limit; i < response.body.tracks.total; i += response.body.tracks.limit) {
			promises.push(spotifyClient.getPlaylistTracks(id, { offset: i, limit: response.body.tracks.limit }));
		}
		return Promise.all(promises)
			.then((responses) => {
				responses.forEach((tracksResponse) => {
					output.tracks = output.tracks.concat(tracksResponse.body.items);
				});
				return output;
			});
	}
	return output;
};

/**
 * Returns data about a single playlist.
 * @param {object} req
 * @param {object} res
 * @returns {Promise}
 */
exports.show = (req, res) => {
	const output = {};
	return Spotify.authenticate(req)
		.then(() => spotifyClient.getPlaylist(req.params.id))
		.then((response) => getAllPlaylistTracks(req.params.id, response, output))
		.then((data) => sendSuccess(res, formatPlaylist(data)))
		.catch((response) => {
			sendError(res, response);
		});
};

/**
 * Exports a playlist to CSV.
 * @param {object} req
 * @param {object} res
 * @returns {Promise}
 */
exports.csv = (req, res) => {
	const output = {};
	Spotify.authenticate(req)
		.then(() => spotifyClient.getPlaylist(req.params.id))
		.then((response) => getAllPlaylistTracks(req.params.id, response, output))
		.then((response) => {
			const filename = `mendrek-playlist-${req.params.id}.csv`;
			return sendFile(res, filename, csv(response));
		})
		.catch((response) => sendError(res, response));
};

/**
 * Exports a playlist to JSON.
 * @param {object} req
 * @param {object} res
 * @returns {Promise}
 */
exports.json = (req, res) => {
	const output = {};
	Spotify.authenticate(req)
		.then(() => spotifyClient.getPlaylist(req.params.id))
		.then((response) => getAllPlaylistTracks(req.params.id, response, output))
		.then((response) => {
			const filename = `mendrek-playlist-${req.params.id}.json`;
			return sendFile(res, filename, json(response));
		})
		.catch((response) => sendError(res, response));
};
