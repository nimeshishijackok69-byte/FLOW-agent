import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true, index: true },
    username: { type: String, unique: true, sparse: true },
    passwordHash: { type: String },
    role: {
        type: String,
        enum: ['admin', 'reviewer', 'functionary', 'teacher'],
        required: true
    },
    profile: {
        fullName: { type: String, required: true },
        phone: String,
        schoolName: String,
        schoolCode: String,
        district: String,
    },
    assignedLevels: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Level' }],
    isActive: { type: Boolean, default: true },
    loginAttempts: { type: Number, default: 0 },
    lockUntil: { type: Number },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });
// Hash password before saving
userSchema.pre('save', async function () {
    if (!this.isModified('passwordHash') || !this.passwordHash)
        return;
    const salt = await bcrypt.genSalt(12);
    this.passwordHash = await bcrypt.hash(this.passwordHash, salt);
});
// Method to compare password
userSchema.methods.comparePassword = async function (password) {
    if (!this.passwordHash)
        return false;
    return bcrypt.compare(password, this.passwordHash);
};
export const User = mongoose.model('User', userSchema);
//# sourceMappingURL=User.js.map