import { z } from 'zod';
export const loginSchema = z.object({
    body: z.object({
        email: z.string().email(),
        password: z.string().min(1) // Allowing min 1 for test passwords like 'admin123'
    })
});
export const otpRequestSchema = z.object({
    body: z.object({
        email: z.string().email().optional(),
        phone: z.string().optional()
    }).refine(data => data.email || data.phone, {
        message: "Either email or phone must be provided"
    })
});
export const submissionSchema = z.object({
    body: z.object({
        formId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid form ID'),
        responses: z.array(z.object({
            fieldId: z.string(),
            value: z.any()
        }))
    })
});
//# sourceMappingURL=schemas.js.map