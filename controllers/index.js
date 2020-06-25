import { sendSuccess } from '../utilities/response';

/**
 * @description Shows the main page so we can tell it's working.
 * @param {Object} req
 * @param {Object} res
 */
exports.index = (req, res) => (
	Promise.resolve()
		.then(() => sendSuccess(res, null))
);
