import { createHttpError } from "../utils/httpError.js";

export const notFound = (req, res, next) => {
    next(
        createHttpError(
            404,
            "ROUTE_NOT_FOUND",
            `Route not found: ${req.method} ${req.originalUrl}`
        )
    );
};