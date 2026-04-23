import { Request, Response } from 'express';
import { AuthRequest } from '../middleware/auth.js';
export declare const getForms: (req: AuthRequest, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const getFormByLink: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const createForm: (req: AuthRequest, res: Response) => Promise<void>;
export declare const updateForm: (req: AuthRequest, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
//# sourceMappingURL=forms.d.ts.map