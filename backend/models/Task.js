import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema(
    {
        // Links the task to the User who created it.
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        title: {
            type: String,
            required: true,
            trim: true,
        },
        description: {
            type: String,
            default: '',
        },
        status: {
            type: String,
            enum: ['pending', 'in-progress', 'completed'], // Only these 3 values allowed
            default: 'pending',
        },
        dueDate: {
            type: Date,
        },
    },
    { timestamps: true }
);

export default mongoose.model('Task', taskSchema);