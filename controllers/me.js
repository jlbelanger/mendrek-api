import Spotify from '../utilities/spotify';
import spotifyClient from '../spotify-client';

/**
 * @description Returns info about the current user.
 * @param {Object} req
 * @param {Object} res
 */
exports.index = (req, res) => {
  Spotify.request(req, res, () => spotifyClient.getMe());
};

/**
 * @description Returns info about the current user's playlists.
 * @param {Object} req
 * @param {Object} res
 */
exports.playlists = (req, res) => {
  Spotify.request(req, res, () => spotifyClient.getUserPlaylists());
};
