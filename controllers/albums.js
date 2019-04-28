import Spotify from '../utilities/spotify';
import spotifyClient from '../spotify-client';

/**
 * @description Returns data about a single album.
 * @param {Object} req
 * @param {Object} res
 */
exports.show = (req, res) => {
  Spotify.request(req, res, () => spotifyClient.getAlbum(req.params.id));
};
