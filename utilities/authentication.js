/**
 * @description Calculates the expiry date.
 * @param {number} expiresIn
 * @returns {string}
 */
export function getExpiryDate(expiresIn) {
	if (!expiresIn) {
		return '';
	}
	const date = new Date(Date.now() + (expiresIn * 1000));
	return date.toISOString().slice(0, 19).replace('T', ' ');
}

/**
 * @description Collects session data.
 * @param {Object} body
 * @returns {Object}
 */
export function getSessionData(body) {
	const output = {
		access_token: body.access_token,
		expires: getExpiryDate(body.expires_in),
	};
	if (body.refresh_token) {
		output.refresh_token = body.refresh_token;
	}
	return output;
}

/**
 * @description Finds access token in request.
 * @param {Object} req
 * @returns {string}
 */
export function getToken(req) {
	let token = req.header('Authentication');
	if (token) {
		token = token.replace('Bearer ', '');
	} else if (req.query.token) {
		token = req.query.token;
	} else {
		token = '';
	}
	return token;
}
