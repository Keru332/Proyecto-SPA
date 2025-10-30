const express = require('express');
const router = express.Router();
const PaqueteVendidoController = require('../controllers/paquetevendidoController');

router.get('/', PaqueteVendidoController.getAll);
router.get('/:id', PaqueteVendidoController.getById);
router.post('/', PaqueteVendidoController.create);
router.put('/:id', PaqueteVendidoController.update);
router.delete('/:id/:id2/:id3', PaqueteVendidoController.delete);

module.exports = router;
