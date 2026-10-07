export const errorHandler = (err, req, res, next) => {
    if (err.code === "P2002") {
        return res.status(409).json({
            error: {
                code: "UNIQUE_CONSTRAINT_VIOLATION",
                message: "Resource already exists"
            }
        });
    }

    const statusCode = err.statusCode || 500;
    const code = err.code || "INTERNAL_SERVER_ERROR";
    const message = err.message || "Internal server error";

    const response = {
        error: {
            code,
            message
        }
    };

    if (err.details !== undefined) {
        response.error.details = err.details;
    }

    res.status(statusCode).json(response);
};