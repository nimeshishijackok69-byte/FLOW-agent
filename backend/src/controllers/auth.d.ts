import { Request, Response } from 'express';
export declare const login: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const verifySession: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const requestOTP: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const verifyOTP: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const logout: (req: Request, res: Response) => Promise<void>;
//# sourceMappingURL=auth.d.ts.map