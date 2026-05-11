
export class ApiError extends Error {
    constructor(statusCode = 500, message = "Something went wrong", errors = [], stack = "") {
        super(message);

        this.success = false;
        this.statusCode = statusCode;
        this.errors = errors;
        this.date = null;
        // this.isOperational = true; // distinguish operational vs programming errors

        if (stack) {
            this.stack = stack;
        } else {
            Error.captureStackTrace(this, this.constructor)
        }
    }
}
