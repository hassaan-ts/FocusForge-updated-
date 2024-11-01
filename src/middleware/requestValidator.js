import { validationResult } from 'express-validator';
import logger from '../utils/logger.js';

export const validate = (validations) => {
  return async (req, res, next) => {
    await Promise.all(validations.map(validation => validation.run(req)));

    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }

    logger.warn('Request validation failed', {
      path: req.path,
      errors: errors.array()
    });

    res.status(400).json({
      status: 'error',
      message: 'Invalid request data',
      errors: errors.array()
    });
  };
};