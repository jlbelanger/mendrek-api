import { getToken } from './authentication';
import spotifyClient from '../spotify-client';

export default class Spotify {
	/**
	 * Authenticates Spotify requests.
	 * @param {object} req
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
