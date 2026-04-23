import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';
export const authenticate = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader?.startsWith('Bearer ')) {
            return res.status(401).json({ error: 'Authentication required' });
        }
        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
        const user = await User.findById(decoded.id).select('-passwordHash');
        if (!user) {
            return res.status(401).json({ error: 'User no longer exists' });
        }
        if (!user.isActive) {
            return res.status(403).json({ error: 'User account is deactivated' });
        }
        req.user = user;
        next();
    }
    catch (err) {
        if (err.name === 'TokenExpiredError') {
            return res.status(401).json({ error: 'Token expired', code: 'TOKEN_EXPIRED' });
        }
        res.status(401).json({ error: 'Invalid token' });
    }
};
export const authorize = (...roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ error: 'Authentication required' });
        }
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ error: 'Access denied' });
        }
        next();
    };
};
//# sourceMappingURL=auth.js.map