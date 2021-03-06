import Albums from './controllers/albums';
import Artists from './controllers/artists';
import Authenticate from './controllers/authenticate';
import Index from './controllers/index';
import Me from './controllers/me';
import Playlists from './controllers/playlists';
import { sendError } from './utilities/response';

/**
 * Initializes routes.
 * @param {object} app
 */
module.exports = (app) => {
	app.route('/').get(Index.index);

	app.route('/albums/:id').get(Albums.show);

	app.route('/artists/:id').get(Artists.show);

	app.route('/authenticate').get(Authenticate.index);
	app.route('/authenticate/callback').get(Authenticate.callback);
	app.route('/authenticate/logout').get(Authenticate.logout);
	app.route('/authenticate/refresh').get(Authenticate.refresh);

	app.route('/me').get(Me.index);
	app.route('/me/playlists').get(Me.playlists);

	app.route('/playlists/:id.csv').get(Playlists.csv);
	app.route('/playlists/:id.json').get(Playlists.json);
	app.route('/playlists/:id').get(Playlists.show);

	app.use((req, res) => sendError(res, 'Not found.', 404));
};
