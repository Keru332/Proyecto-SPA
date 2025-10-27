const express = require('express');
const router = express.Router();
const PaqTratController = require('../controllers/paq_tratController');

router.get('/', PaqTratController.getAll);
router.get('/:id', PaqTratController.getById);
router.post('/', PaqTratController.create);
router.put('/:id', PaqTratController.update);
router.delete('/:codpaquete/:codtratamiento', PaqTratController.delete);

module.exports = router;
