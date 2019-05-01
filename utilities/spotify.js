import { getToken } from './authentication';
import spotifyClient from '../spotify-client';

export default class Spotify {
  /**
   * @description Authenticates Spotify requests.
   * @param {Object} req
   * @returns {Promise}
   */
  static authenticate(req) {
    return Promise.resolve()
      .then(() => {
        const accessToken = getToken(req);
        if (!accessToken) {
          throw new Error('No authentication token.');
        }
        spotifyClient.setAccessToken(accessToken);
      });
  }
}
