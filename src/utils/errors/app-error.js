

class AppError extends Error{
    constructor(message,statusCode, isOperational = true) {

        super(message);
        
        this.statusCode = statusCode;
        this.isOperational = isOperational;
        Error.captureStackTrace(this, this.constructor);
    }
}
module.exports = AppError;
// This class is used to create custom error objects that can be thrown in the application.