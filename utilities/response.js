/**
 * @description Returns an unsuccessful response.
 * @param {Object} res
 * @param {Object} response
 * @param {number} status
 */
export function sendError(res, response, status) {
  let sendStatus = status;
  if (!sendStatus && response.statusCode) {
    sendStatus = response.statusCode;
  }
  res.status(sendStatus);
  res.send({
    success: false,
    data: response,
  });
}

/**
 * @description Returns a file.
 * @param {Object} res
 * @param {Object} response
 * @param {string} filename
 * @param {function} outputCallback
 */
export function sendFile(res, response, filename, outputCallback) {
  res.set('Content-Disposition', `attachment; filename=${filename}`);
  res.set('Content-Type', 'application/octet-stream');
  res.send(outputCallback(response));
}

/**
 * @description Returns a successful response.
 * @param {Object} res
 * @param {Object} response
 */
export function sendSuccess(res, response) {
  res.send({
    success: true,
    data: response.body,
  });
}
