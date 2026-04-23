import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.js';
export declare const submitForm: (req: AuthRequest, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const updateSubmission: (req: AuthRequest, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const getSubmissions: (req: AuthRequest, res: Response) => Promise<void>;
export declare const getSubmissionById: (req: AuthRequest, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
//# sourceMappingURL=submissions.d.ts.map