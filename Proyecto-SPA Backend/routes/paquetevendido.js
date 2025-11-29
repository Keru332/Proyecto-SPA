const express = require('express');
const router = express.Router();
const PaqueteVendidoController = require('../controllers/paquetevendidoController');
const { authenticateToken, requireRole, requireOwnershipOrAdminByClient, requireOwnershipOrAdminPaquete } = require('../middleware/auth');

router.get('/',authenticateToken,requireRole('admin'), PaqueteVendidoController.getAll);
//router.get('/:id',authenticateToken,PaqueteVendidoController.getById);

router.get('/filtro/:periodo', authenticateToken,requireRole('admin'), PaqueteVendidoController.getByPeriodo);
router.get('/activos/:id', authenticateToken, requireOwnershipOrAdminByClient, PaqueteVendidoController.getByClienteActivos);
router.get('/expirados/:id', authenticateToken, requireOwnershipOrAdminByClient, PaqueteVendidoController.getByClienteExpirados);

router.post('/',authenticateToken,PaqueteVendidoController.create);
//router.put('/:id',authenticateToken, requireOwnershipOrAdminByClient,requireRole('admin'),PaqueteVendidoController.update);
router.delete('/:id/:id2/:id3',authenticateToken, requireOwnershipOrAdminPaquete, PaqueteVendidoController.delete);

module.exports = router;
