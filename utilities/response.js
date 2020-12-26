/**
 * Returns an unsuccessful response.
 * @param {object} res
 * @param {object} response
 * @param {number} status
 * @returns {Promise}
 */
export function sendError(res, response, status) {
	let sendStatus = status;
	if (!sendStatus) {
		if (response.statusCode) {
			sendStatus = response.statusCode;
		} else {
			sendStatus = 401;
		}
	}

	let data = response;
	if (response instanceof Error) {
		data = response.message;
	}

	res.status(sendStatus);
	res.send({
		success: false,
		data,
	});

	return Promise.resolve();
}

/**
 * Returns a file.
 * @param {object} res
 * @param {string} filename
 * @param {object} data
 * @returns {Promise}
 */
export function sendFile(res, filename, data) {
	res.set('Content-Disposition', `attachment; filename=${filename}`);
	res.set('Content-Type', 'application/octet-stream');
	res.send(data);
	return Promise.resolve();
}

/**
 * Returns a successful response.
 * @param {object} res
 * @param {object} response
 * @returns {Promise}
 */
export function sendSuccess(res, response) {
	res.status(200);
	res.send({
		success: true,
		data: response,
	});
	return Promise.resolve();
}
