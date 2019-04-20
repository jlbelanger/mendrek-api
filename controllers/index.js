/**
 * @description Shows the main page so we can tell it's working.
 * @param {Object} req
 * @param {Object} res
 */
exports.index = (req, res) => {
  res.send({ success: true });
};
