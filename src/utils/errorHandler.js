import { ValidationError } from 'express-validator';

export class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    Error.captureStackTrace(this, this.constructor);
  }
}

export const handleError = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    res.status(err.statusCode).json({
      status: err.status,
      error: err,
      message: err.message,
      stack: err.stack
    });
  } else {
    // Production error response
    if (err instanceof ValidationError) {
      return res.status(400).json({
        status: 'fail',
        message: 'Invalid input data',
        errors: err.array()
      });
    }

    if (err.name === 'CastError') {
      return res.status(400).json({
        status: 'fail',
        message: 'Invalid ID format'
      });
    }

    if (err.code === 11000) {
      return res.status(400).json({
        status: 'fail',
        message: 'Duplicate field value'
      });
    }

    if (err.name === 'ValidationError') {
      return res.status(400).json({
        status: 'fail',
        message: 'Invalid input data',
        errors: Object.values(err.errors).map(e => e.message)
      });
    }

    res.status(500).json({
      status: 'error',
      message: 'Something went wrong'
    });
  }
};