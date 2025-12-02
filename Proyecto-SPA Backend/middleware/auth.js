const jwt = require('jsonwebtoken');
const Cita = require('../models/cita');

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Formato de autorización inválido' });
  }
  
  const token = authHeader.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: 'Token de acceso requerido' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      if (err.name === 'TokenExpiredError') {
        return res.status(403).json({ error: 'Token expirado' });
      }
      if (err.name === 'JsonWebTokenError') {
        return res.status(403).json({ error: 'Token inválido' });
      }
      return res.status(403).json({ error: 'Error al verificar token' });
    }
    
    if (!user || !user.id || !user.role) {
      return res.status(403).json({ error: 'Estructura de token inválida' });
    }
    
    req.user = user;
    next();
  });
};

const requireRole = (role) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(403).json({ error: 'Usuario no autenticado' });
    }
    
    if (req.user.role !== role && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Permisos insuficientes' });
    }
    next();
  };
};

const requireOwnershipOrAdminByClient = (req, res, next) => {
  if (!req.user) {
    return res.status(403).json({ error: 'Usuario no autenticado' });
  }
  
  const resourceUserId = req.body.cliente_idcliente || req.params.id  ;
  console.log(req.body)
  console.log(req.params)
  
  if (req.user.role !== 'admin' && req.user.idcliente !== resourceUserId) {
    return res.status(403).json({ error: 'No tienes permisos sobre este recurso' });
  }
  next();
};

const requireOwnershipOrAdminCita = async (req, res, next) => {
  if (!req.user) {
    return res.status(403).json({ error: 'Usuario no autenticado' });
  }

  const cita = await Cita.getById(req.params.id)
  resourceUserId = cita.cliente__idcliente
  
  if (req.user.role !== 'admin' && req.user.idcliente !== resourceUserId) {
    return res.status(403).json({ error: 'No tienes permisos sobre este recurso' });
  }
  next();
};

const requireOwnershipOrAdminPaquete = async (req, res, next) => {
  if (!req.user) {
    return res.status(403).json({ error: 'Usuario no autenticado' });
  }

  if (req.user.role !== 'admin' && req.user.idcliente !== req.params.id2) {
    return res.status(403).json({ error: 'No tienes permisos sobre este recurso' });
  }
  console.log('paso por aqui')
  next();
};

const requireOwnershipOrAdminByUser = (req, res, next) => {
  if (!req.user) {
    return res.status(403).json({ error: 'Usuario no autenticado' });
  }
  
  const resourceUserId = req.body.id || req.params.id  ;
  console.log(req.body)
  console.log(req.params)
  console.log(resourceUserId)
  console.log(req.user.id)
  
  if (req.user.role !== 'admin' && req.user.id != resourceUserId) {
    return res.status(403).json({ error: 'No tienes permisos sobre este recurso' });
  }
  next();
};

module.exports = { 
  authenticateToken, 
  requireRole, 
  requireOwnershipOrAdminByClient,
  requireOwnershipOrAdminCita,
  requireOwnershipOrAdminPaquete,
  requireOwnershipOrAdminByUser
};
