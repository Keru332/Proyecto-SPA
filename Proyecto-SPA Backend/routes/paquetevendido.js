const express = require('express');
const router = express.Router();
const PaqueteVendidoController = require('../controllers/paquetevendidoController');
const { authenticateToken, requireRole } = require('../middleware/auth');

router.get('/',authenticateToken,requireRole('admin'), PaqueteVendidoController.getAll);
router.get('/:id',authenticateToken,PaqueteVendidoController.getById);

router.get('/filtro/:periodo', authenticateToken,requireRole('admin'), PaqueteVendidoController.getByPeriodo);
router.get('/activos/:id', authenticateToken, PaqueteVendidoController.getByClienteActivos);
router.get('/expirados/:id', authenticateToken, PaqueteVendidoController.getByClienteExpirados);

router.post('/',authenticateToken,PaqueteVendidoController.create);
router.put('/:id',authenticateToken,requireRole('admin'),PaqueteVendidoController.update);
router.delete('/:id/:id2/:id3',authenticateToken, PaqueteVendidoController.delete);

module.exports = router;
