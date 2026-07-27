// Runs when a request hits a route that doesn't exist.

export function notFound(req, res, next) {
  res.status(404).json({ message: `Route not found: ${req.originalUrl}` });
}


// Express recognizes this as an error-handling middleware because it takes FOUR arguments (err, req, res, next). Any time a controller calls
// next(err), or throws inside an async function we've wrapped in try/catch, execution lands here.

export function errorHandler(err, req, res, next) {
    console.error(err.stack);

    // Mongoose validation error
    if (err.name === 'ValidationError') {
        const messages = Object.values(err.errors).map((e) => e.message);
        return res.status(400).json({ message: messages.join(', ') });
    }

    // Mongoose duplicate key error (e.g. email already exists)
    if (err.code === 11000) {
        const field = Object.keys(err.keyValue)[0];
        return res.status(409).json({ message: `${field} already in use` });
    }

    // Invalid MongoDB ObjectId format (e.g. malformed task id in the URL)
    if (err.name === 'CastError') {
        return res.status(400).json({ message: 'Invalid ID format' });
    }

    // Fallback: generic server error
    const statusCode = res.statusCode !== 200 ? res.statusCode : 500;
    res.status(statusCode).json({
        message: err.message || 'Server error',
    });
}