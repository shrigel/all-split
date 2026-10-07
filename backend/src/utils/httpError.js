export const createHttpError = (statusCode, code, message, details = undefined) => {
    const error = new Error(message);

    error.statusCode = statusCode;
    error.code = code;

    if (details !== undefined) {
        error.details = details;
    }

    return error;
};