const express = require('express');
const router = express.Router();
const PaqueteVendidoController = require('../controllers/paquetevendidoController');

router.get('/', PaqueteVendidoController.getAll);
router.get('/:id', PaqueteVendidoController.getById);
router.post('/', PaqueteVendidoController.create);
router.put('/:id', PaqueteVendidoController.update);
router.delete('/:id', PaqueteVendidoController.delete);

module.exports = router;
