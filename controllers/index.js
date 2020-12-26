import { sendSuccess } from '../utilities/response';

/**
 * Shows the main page so we can tell it's working.
 * @param {object} req
 * @param {object} res
 */
exports.index = (req, res) => (
	Promise.resolve()
		.then(() => sendSuccess(res, null))
);
