import jwt from 'jsonwebtoken';

// Express middleware function: (req, res, next).
// Runs BEFORE the route handler, and can either call next() to continue, or send a response directly to stop the request

export function protect(req, res, next) {
    const authHeader = req.headers.authorization; // expects 'Bearer <token>'

    if (!authHeader || !authHeader.startsWith('Bearer ')){
        return res.status(401).json({ message: 'Not authorized, no token provided' });
    }

    // Extract just the token part, after "Bearer"
    const token = authHeader.split(' ')[1];

    try {
        // Verifies the token's signature using our secret key, and decodes the payload we originally signed it with (the user id)
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Attach the user's id to the request object so later route handlers (in taskController.js) know WHO is making the request.
        req.userId = decoded.id;
        next(); // move on to the actual route handler
    } catch (err) {
        return res.status(401).json({ message: 'Not authorized, token invalid or expired' });
    }
}