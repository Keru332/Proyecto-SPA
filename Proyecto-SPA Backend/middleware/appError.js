class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = 'ValidationError';
    this.statusCode = 400;
  }
}

class NotFoundError extends Error {
  constructor(resource = 'Recurso') {
    super(`${resource} no encontrado`);
    this.name = 'NotFoundError';
    this.statusCode = 404;
  }
}

class DuplicateError extends Error {
  constructor(resource = 'Recurso') {
    super(`${resource} ya existe`);
    this.name = 'DuplicateError';
    this.statusCode = 409;
  }
}

class DatabaseError extends Error {
  constructor(message = 'Error de base de datos') {
    super(message);
    this.name = 'DatabaseError';
    this.statusCode = 500;
  }
}

class InvalidIdError extends Error {
  constructor(resource = 'ID') {
    super(`${resource} no válido`);
    this.name = 'InvalidIdError';
    this.statusCode = 400;
  }
}

module.exports = {
  ValidationError,
  NotFoundError,
  DuplicateError,
  DatabaseError,
  InvalidIdError
};