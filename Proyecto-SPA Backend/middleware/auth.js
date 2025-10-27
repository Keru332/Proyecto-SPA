const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  
  // Validación más robusta
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Formato de autorización inválido' });
  }
  
  const token = authHeader.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: 'Token de acceso requerido' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      // Diferentes errores para mejor debugging
      if (err.name === 'TokenExpiredError') {
        return res.status(403).json({ error: 'Token expirado' });
      }
      if (err.name === 'JsonWebTokenError') {
        return res.status(403).json({ error: 'Token inválido' });
      }
      return res.status(403).json({ error: 'Error al verificar token' });
    }
    
    // Validar estructura del usuario decodificado
    if (!user || !user.id || !user.role) {
      return res.status(403).json({ error: 'Estructura de token inválida' });
    }
    
    req.user = user;
    next();
  });
};

const requireRole = (role) => {
  return (req, res, next) => {
    // Validar que el usuario esté autenticado
    if (!req.user) {
      return res.status(403).json({ error: 'Usuario no autenticado' });
    }
    
    // Validar roles
    if (req.user.role !== role && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Permisos insuficientes' });
    }
    next();
  };
};

// Middleware para verificar que el usuario es el dueño del recurso
const requireOwnershipOrAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(403).json({ error: 'Usuario no autenticado' });
  }
  
  const resourceUserId = req.params.userId || req.body.userId;
  
  if (req.user.role !== 'admin' && req.user.id !== resourceUserId) {
    return res.status(403).json({ error: 'No tienes permisos sobre este recurso' });
  }
  
  next();
};

module.exports = { 
  authenticateToken, 
  requireRole, 
  requireOwnershipOrAdmin 
};
