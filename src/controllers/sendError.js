/**
 * Maps a thrown error to an HTTP response. Errors carrying a `statusCode`
 * (NotFoundError, ValidationError) are surfaced to the client; anything else
 * is reported as a generic 500 without leaking internals.
 *
 * @param {import("express").Response} res
 * @param {Error & { statusCode?: number }} error
 */
function sendError(res, error) {
  const statusCode = error.statusCode || 500;
  const message = statusCode === 500 ? "Internal server error" : error.message;
  res.status(statusCode).json({ error: message });
}

module.exports = sendError;
