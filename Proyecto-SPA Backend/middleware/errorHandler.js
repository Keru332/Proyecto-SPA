const {
  ValidationError,
  NotFoundError,
  DuplicateError,
  DatabaseError,
  InvalidIdError
} = require('./appError');

const errorHandler = (err, req, res, next) => {
  console.error('Error:', {
    name: err.name,
    message: err.message,
    code: err.code,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });

  if (err instanceof ValidationError) {
    return res.status(400).json({
      error: 'Error de validación',
      message: err.message
    });
  }

  if (err instanceof NotFoundError) {
    return res.status(404).json({
      error: 'No encontrado',
      message: err.message
    });
  }

  if (err instanceof DuplicateError) {
    return res.status(409).json({
      error: 'Recurso duplicado',
      message: err.message
    });
  }

  if (err instanceof InvalidIdError) {
    return res.status(400).json({
      error: 'ID inválido',
      message: err.message
    });
  }

  if (err instanceof DatabaseError) {
    return res.status(500).json({
      error: 'Error de base de datos',
      message: err.message
    });
  }

  // Errores de PostgreSQL
  if (err.code === '23505') {
    return res.status(409).json({
      error: 'Registro duplicado',
      message: 'Ya existe un registro con estos datos'
    });
  }

  if (err.code === '23503') {
    return res.status(409).json({
      error: 'Recurso con dependencia',
      message: 'No se puede realizar la operación debido a que otro recurso necesita de este.'
    });
  }

  if (err.code === '23502') {
    return res.status(400).json({
      error: 'Campo requerido',
      message: 'Uno o más campos obligatorios no fueron proporcionados'
    });
  }

  if (err.code === '22001') {
    return res.status(400).json({
      error: 'Datos demasiado largos',
      message: 'Uno o más campos exceden la longitud permitida'
    });
  }

  if (err.code === '22P02') {
    return res.status(400).json({
      error: 'ID inválido',
      message: 'El formato del ID no es válido'
    });
  }

  if (err.code === '23514') {
    return res.status(400).json({
      error: 'Restricción de validación',
      message: 'Los datos no cumplen con las reglas de validación definidas'
    });
  }

  res.status(500).json({
    error: 'Error interno del servidor',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
};

module.exports = errorHandler;