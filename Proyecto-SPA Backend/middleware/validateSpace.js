// middleware/validateSpaces.js
function validateSpaces(req, res, next) {
  const invalidFields = [];

  if (req.body && typeof req.body === 'object') {
    for (const [key, value] of Object.entries(req.body)) {
      if (typeof value === 'string') {
        // Recortamos automáticamente los espacios al inicio y final
        const trimmed = value.trim();
        req.body[key] = trimmed;

        // Validamos: no debe quedar vacío ni tener espacios repetidos internos
        if (trimmed.length === 0 || /\s{2,}/.test(trimmed)) {
          invalidFields.push(key);
        }
      }
    }
  }

  if (invalidFields.length > 0) {
    return res.status(400).json({
      error: `Campos inválidos: ${invalidFields.join(', ')}. No pueden estar vacíos ni tener espacios repetidos.`,
    });
  }

  next();
}

module.exports = validateSpaces;


