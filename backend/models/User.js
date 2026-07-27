import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

// Defines the shape of User document in MongoDB
const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        email: {
            type: String,
            required: true,
            unique: true, // no two users can share an email
            lowercase: true,
            trim: true,
        },
        password: {
            type: String,
            required: true,
            minlength: 6,
        },
    },
    { timestamps: true} // adds createdAt / updatedAt automaticaaly
);

// Mongoose middleware: runs automatically BEFORE a user document is saved.
// If the password field was changed (e.g. on registration), hash it with bcrypt before storing it — we never store plain-text passwords.

userSchema.pre('save', async function (next) {
    if(!this.isModified('password')) return next();
    const salt = await bcrypt.genSalt(10); // generates random 'salt' data
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// Instance method: lets us do user.comparePassword('typedPassword') during login, to check it against the stored hash.

userSchema.methods.comparePassword = function (candidate) {
    return bcrypt.compare(candidate, this.password);
};

export default mongoose.model('User', userSchema);