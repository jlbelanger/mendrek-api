import { getToken } from './authentication';
import { sendError, sendFile, sendSuccess } from './response';
import spotifyClient from '../spotify-client';

export default class Spotify {
  /**
   * @description Exports Spotify data as a file.
   * @param {Object} req
   * @param {Object} res
   * @param {function} promise
   * @param {string} filename
   * @param {function} outputCallback
   */
  static export(req, res, promise, filename, outputCallback) {
    if (Spotify.authenticateRequest(req, res)) {
      promise().then(response => sendFile(res, response, filename, outputCallback))
        .catch(response => sendError(res, response));
    }
  }

  /**
   * @description Makes an authenticated request to Spotify.
   * @param {Object} req
   * @param {Object} res
   * @param {function} promise
   */
  static request(req, res, promise) {
    if (Spotify.authenticateRequest(req, res)) {
      promise().then(response => sendSuccess(res, response.body))
        .catch(response => sendError(res, response));
    }
  }

  /**
   * @description Authenticates Spotify requests.
   * @param {Object} req
   * @param {Object} res
   * @returns {boolean}
   */
  static authenticateRequest(req, res) {
    const accessToken = getToken(req);
    if (!accessToken) {
      sendError(res, 'No authentication token.', 401);
      return false;
    }

    spotifyClient.setAccessToken(accessToken);
    return true;
  }
}
