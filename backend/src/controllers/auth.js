import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';
import { AuditLog } from '../models/AuditLog.js';
const generateTokens = (userId) => {
    const accessToken = jwt.sign({ id: userId }, process.env.JWT_ACCESS_SECRET, { expiresIn: '1h' });
    const refreshToken = jwt.sign({ id: userId }, process.env.JWT_REFRESH_SECRET, { expiresIn: '7d' });
    return { accessToken, refreshToken };
};
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user || !(await user.comparePassword(password))) {
            await AuditLog.create({
                action: 'login_failed',
                metadata: { email, ip: req.ip }
            });
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        const { accessToken, refreshToken } = generateTokens(user._id.toString());
        await AuditLog.create({
            userId: user._id,
            action: 'login_success',
            metadata: { ip: req.ip, userAgent: req.headers['user-agent'] }
        });
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });
        res.status(200).json({
            token: accessToken,
            accessToken,
            user: {
                id: user._id,
                name: user.profile.fullName,
                email: user.email,
                role: user.role,
                school_code: user.profile.schoolCode
            }
        });
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
};
export const verifySession = async (req, res) => {
    try {
        const { token } = req.body;
        if (!token)
            return res.status(401).json({ error: 'Token required' });
        const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
        const user = await User.findById(decoded.id);
        if (!user)
            return res.status(401).json({ error: 'User not found' });
        res.status(200).json({
            user: {
                id: user._id,
                name: user.profile.fullName,
                email: user.email,
                role: user.role,
                school_code: user.profile.schoolCode
            }
        });
    }
    catch (err) {
        res.status(401).json({ error: 'Invalid token' });
    }
};
export const requestOTP = async (req, res) => {
    try {
        const { email, phone } = req.body;
        const user = await User.findOne(email ? { email } : { 'profile.phone': phone });
        if (!user)
            return res.status(404).json({ error: 'User not found' });
        const otp = '123456'; // Use 123456 for manual testing locally
        await AuditLog.create({
            userId: user._id,
            action: 'otp_requested',
            metadata: { method: email ? 'email' : 'phone', ip: req.ip }
        });
        res.status(200).json({ success: true, message: 'OTP sent successfully (Use 123456)' });
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
};
export const verifyOTP = async (req, res) => {
    try {
        const { email, phone, otp } = req.body;
        if (otp !== '123456')
            return res.status(401).json({ error: 'Invalid OTP' });
        const user = await User.findOne(email ? { email } : { 'profile.phone': phone });
        if (!user)
            return res.status(404).json({ error: 'User not found' });
        const { accessToken, refreshToken } = generateTokens(user._id.toString());
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000
        });
        res.status(200).json({
            token: accessToken,
            accessToken,
            user: {
                id: user._id,
                name: user.profile.fullName,
                email: user.email,
                role: user.role,
                school_code: user.profile.schoolCode
            }
        });
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
};
export const logout = async (req, res) => {
    res.clearCookie('refreshToken');
    res.status(200).json({ success: true });
};
//# sourceMappingURL=auth.js.map