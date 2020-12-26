/**
 * Calculates the expiry date.
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
 * Collects session data.
 * @param {object} body
 * @returns {object}
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
 * Finds access token in request.
 * @param {object} req
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
