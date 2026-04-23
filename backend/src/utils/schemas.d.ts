import { z } from 'zod';
export declare const loginSchema: z.ZodObject<{
    body: z.ZodObject<{
        email: z.ZodString;
        password: z.ZodString;
    }, z.core.$strip>;
}, z.core.$strip>;
export declare const otpRequestSchema: z.ZodObject<{
    body: z.ZodObject<{
        email: z.ZodOptional<z.ZodString>;
        phone: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>;
}, z.core.$strip>;
export declare const submissionSchema: z.ZodObject<{
    body: z.ZodObject<{
        formId: z.ZodString;
        responses: z.ZodArray<z.ZodObject<{
            fieldId: z.ZodString;
            value: z.ZodAny;
        }, z.core.$strip>>;
    }, z.core.$strip>;
}, z.core.$strip>;
//# sourceMappingURL=schemas.d.ts.map