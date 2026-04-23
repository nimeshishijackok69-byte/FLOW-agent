import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import { rateLimit } from 'express-rate-limit';
import path from 'path';
import { fileURLToPath } from 'url';
import authRoutes from './routes/auth.js';
import formRoutes from './routes/forms.js';
import submissionRoutes from './routes/submissions.js';
import statsRoutes from './routes/stats.js';
import auditRoutes from './routes/audit.js';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
// Security Middlewares
app.use(helmet());
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true
}));
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(express.json());
app.use(morgan('dev'));
// Rate Limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100,
    message: 'Too many requests from this IP, please try again after 15 minutes'
});
app.use('/api', limiter);
// Static files
app.use('/uploads', express.static(path.join(__dirname, '../../uploads')));
// Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/forms', formRoutes);
app.use('/api/v1/submissions', submissionRoutes);
app.use('/api/v1/stats', statsRoutes);
app.use('/api/v1/audit-logs', auditRoutes);
// Health check
app.get('/health', (req, res) => res.status(200).json({ status: 'ok' }));
// Global error handler
app.use((err, req, res, next) => {
    const status = err.status || 500;
    const message = process.env.NODE_ENV === 'production' && status === 500
        ? 'Internal Server Error'
        : err.message;
    console.error(`[\u274C Error] ${status} - ${message}`);
    if (err.stack && process.env.NODE_ENV !== 'production')
        console.error(err.stack);
    res.status(status).json({ error: message });
});
export default app;
//# sourceMappingURL=app.js.map