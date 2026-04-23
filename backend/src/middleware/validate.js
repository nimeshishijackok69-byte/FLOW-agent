import { ZodError } from 'zod';
export const validate = (schema) => {
    return async (req, res, next) => {
        try {
            await schema.parseAsync({
                body: req.body,
                query: req.query,
                params: req.params,
            });
            next();
        }
        catch (error) {
            if (error instanceof ZodError) {
                return res.status(400).json({
                    error: 'Validation failed',
                    details: error.errors.map(e => ({ path: e.path, message: e.message }))
                });
            }
            return res.status(500).json({ error: 'Internal server error' });
        }
    };
};
//# sourceMappingURL=validate.js.map