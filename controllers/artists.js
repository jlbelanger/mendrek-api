import Spotify from '../utilities/spotify';
import spotifyClient from '../spotify-client';
import { formatArtist } from '../utilities/format';
import { sendError, sendSuccess } from '../utilities/response';

/**
 * @description Returns data about a single artist.
 * @param {Object} req
 * @param {Object} res
 * @returns {Promise}
 */
exports.show = (req, res) => (
  Spotify.authenticate(req)
    .then(() => Promise.all([
      spotifyClient.getArtist(req.params.id),
      spotifyClient.getArtistAlbums(req.params.id, { include_groups: 'album' }),
    ]))
    .then(([artist, albums]) => {
      const promises = [artist, albums];
      if (albums.body.total > albums.body.limit) {
        const num = Math.ceil(albums.body.total / albums.body.limit);
        let i;
        for (i = 1; i < num; i += 1) {
          promises.push(spotifyClient.getArtistAlbums(req.params.id, { include_groups: 'album', offset: (i * albums.body.limit) }));
        }
      }
      return Promise.all(promises);
    })
    .then(([artist, ...albums]) => {
      const promises = [artist];
      const albumIds = albums.map(a => a.body.items.map(album => album.id));
      const num = albumIds.length;
      let i;
      for (i = 0; i < num; i += 1) {
        promises.push(spotifyClient.getAlbums(albumIds[i]));
      }
      return Promise.all(promises);
    })
    .then(([artist, ...albums]) => sendSuccess(res, formatArtist(artist.body, albums)))
    .catch(response => sendError(res, response))
);
