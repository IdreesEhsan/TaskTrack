import mongoose from 'mongoose';

// Connects to MongoDB Atlas using the connection string from .env.
// This is called once when the server starts.

export async function connectDB() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB connected');
    } catch (err) {
        console.error('MongoDB connection error:', err.message);
        process.exit(1)
    }
}