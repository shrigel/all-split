import { createHttpError } from "../utils/httpError.js";

export const validate = (schema) => {
    return (req, res, next) => {
        const result = schema.safeParse({
            body: req.body,
            params: req.params,
            query: req.query,
        });

        if (!result.success) {
            return next(
                createHttpError(
                    400,
                    "VALIDATION_ERROR",
                    "Validation failed",
                    result.error.issues
                )
            );
        }

        req.validated = result.data;

        next();
    };
};