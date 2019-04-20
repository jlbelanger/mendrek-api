import { csv, json } from '../utilities/format';
import Spotify from '../utilities/spotify';
import spotifyClient from '../spotify-client';

/**
 * @description Returns data about a single playlist.
 * @param {Object} req
 * @param {Object} res
 */
exports.show = (req, res) => {
  Spotify.request(req, res, () => spotifyClient.getPlaylist(req.params.id));
};

/**
 * @description Exports a playlist to CSV.
 * @param {Object} req
 * @param {Object} res
 */
exports.csv = (req, res) => {
  Spotify.export(
    req,
    res,
    () => spotifyClient.getPlaylist(req.params.id),
    `mendrek-playlist-${req.params.id}.csv`,
    data => csv(data),
  );
};

/**
 * @description Exports a playlist to JSON.
 * @param {Object} req
 * @param {Object} res
 */
exports.json = (req, res) => {
  Spotify.export(
    req,
    res,
    () => spotifyClient.getPlaylist(req.params.id),
    `mendrek-playlist-${req.params.id}.json`,
    data => json(data),
  );
};
