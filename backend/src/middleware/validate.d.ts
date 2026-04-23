import { Request, Response, NextFunction } from 'express';
import { ZodObject } from 'zod';
export declare const validate: (schema: ZodObject<any>) => (req: Request, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
//# sourceMappingURL=validate.d.ts.map