import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';

interface ValidationErrorDetail {
  field: string;
  message: string;
}

interface ValidationErrorResponse {
  success: false;
  errors: ValidationErrorDetail[];
}

/**
 * Creates a middleware function that validates request data against a Joi schema.
 *
 * This is a factory function that returns an Express middleware for request validation.
 * The middleware validates the specified request data (body, params, or query) against
 * the provided Joi schema and handles validation errors in a consistent way.
 *
 * @template T - The type that the schema validates to. This ensures type safety between
 *               the validation schema and the expected data type.
 * @param {Joi.ObjectSchema<T>} schema - The Joi schema to validate against. Should be
 *                                      an object schema that validates to type T.
 * @param {('body'|'params'|'query')} [source='body'] - The request property to validate.
 *                                                      Defaults to 'body'.
 * @returns {import('express').RequestHandler} Express middleware that:
 *   - On validation success: Calls next() to proceed to the next middleware/controller
 *   - On validation failure: Sends a 400 response with structured validation errors
 *                          in the format {success: false, errors: [{field, message}]}
 */
export const validate = <T>(
  schema: Joi.ObjectSchema<T>,
  source: 'body' | 'params' | 'query' = 'body'
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error } = schema.validate(req[source], {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      const errors = error.details.map((detail) => ({
        field: detail.path.join('.') || detail.context?.key || 'unknown',
        message: detail.message
      }));
      return res.status(400).json({ success: false, errors });
    }

    next();
  };
};
