/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * Base class for all application errors.
 */
export abstract class AppError extends Error {
  public readonly statusCode: number;
  public readonly code: string;

  constructor(message: string, statusCode = 400, code?: string) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.code = code || this.constructor.name;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

/**
 * Thrown when a resource is not found. (HTTP 404)
 */
export class NotFoundError extends AppError {
  constructor(resource: string) {
    super(`${resource} not found.`, 404);
  }
}

/**
 * Thrown when an operation is unauthorized. (HTTP 401)
 */
export class UnauthorizedError extends AppError {
  constructor(message = 'Unauthorized.') {
    super(message, 401);
  }
}

/**
 * Thrown when an operation is forbidden. (HTTP 403)
 */
export class ForbiddenError extends AppError {
  constructor(message = 'Access denied.') {
    super(message, 403);
  }
}

/**
 * Thrown when there is a business rule conflict (e.g., duplicate email). (HTTP 409)
 */
export class ConflictError extends AppError {
  constructor(message: string) {
    super(message, 409);
  }
}

/**
 * Thrown when input data is invalid. (HTTP 422)
 */
export class ValidationError extends AppError {
  public readonly errors?: any;

  constructor(message: string, errors?: any) {
    super(message, 422);
    this.errors = errors;
  }
}
