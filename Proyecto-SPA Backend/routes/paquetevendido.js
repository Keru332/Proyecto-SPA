const express = require('express');
const router = express.Router();
const PaqueteVendidoController = require('../controllers/paquetevendidoController');
const { authenticateToken, requireRole } = require('../middleware/auth');

router.get('/',authenticateToken,requireRole('admin'), PaqueteVendidoController.getAll);
router.get('/:id',authenticateToken,PaqueteVendidoController.getById);
router.post('/',authenticateToken,PaqueteVendidoController.create);
router.put('/:id',authenticateToken,requireRole('admin'),PaqueteVendidoController.update);
router.delete('/:id/:id2/:id3',authenticateToken,requireRole('admin'), PaqueteVendidoController.delete);

module.exports = router;
