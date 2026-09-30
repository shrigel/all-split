export const errorHandler = (err, req, res, next) => {
    const statusCode = err.statusCode || 500;

    const response = {
        error: err.message || 'Internal server error',
    };

    if (err.details) {
        response.details = err.details;
    }

    res.status(statusCode).json(response);
};