const express = require('express');
const router = express.Router();
const PaqueteController = require('../controllers/paqueteController');

router.get('/', PaqueteController.getAll);
router.get('/:id', PaqueteController.getById);
router.post('/', PaqueteController.create);
router.put('/:id', PaqueteController.update);
router.delete('/:id', PaqueteController.delete);

module.exports = router;
