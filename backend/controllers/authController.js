import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// Helper: creates a signed JWT containing the user's id, valid for 7 days.

function generateToken(userId) {
    return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
        expiresIn: '7d',
    });
}

// POST /api/auth/register
export async function register(req, res, next) {
    try {
        const { name, email, password } = req.body;

        // Basic Validation - meaningful error responses
        if (!name || !email || !password) {
            return res.status(400).json({ message: 'Name, email, and password are required' });
        }
        if (password.length < 6) {
            return res.status(400).json({ message: 'Password must be at least 6 characters' });
        }

        // Check if a user with this email already exists
        const existing = await User.findOne({ email });
        if (existing) {
            return res.status(409).json({ message: 'Email already registered' });
        }
        
        // Creates the user — the pre('save') hook in User.js hashes the password automatically
        const user = await User.create({ name, email, password });

        const token = generateToken(user._id);
        // Send back the token + basic user info (never send the password back!)
        res.status(201).json({
            token,
            user: { id: user._id, name: user.name, email: user.email },
        });
    } catch (err) {
        next(err); // hand off to errorHandler.js
    }
}

// POST /api/auth/login
export async function login(req, res, next) {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }

        const user = await User.findOne({ email });
        if (!user) {
            // Same message for "no user" and "wrong password" on purpose — don't reveal which one it was, that's a small security best practice.
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        const match = await user.comparePassword(password);
        if (!match) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        const token = generateToken(user._id);
        res.json({
            token,
            user: { id: user._id, name: user.name, email: user.email },
        });
    } catch (err) {
        next(err);
    }
}