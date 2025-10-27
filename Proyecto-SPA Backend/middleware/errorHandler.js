const errorHandler = (err, req, res, next) => {
  console.error(err.stack);
  
  if (err.code === '23505') {
    return res.status(400).json({ error: 'Registro duplicado' });
  }
  
  if (err.code === '23503') {
    return res.status(400).json({ error: 'Violación de llave foránea' });
  }
  
  res.status(500).json({ 
    error: 'Error interno del servidor',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
};

module.exports = errorHandler;
