const express = require('express');
const router = express.Router();
const MatTratController = require('../controllers/mat_tratController');

router.get('/', MatTratController.getAll);
router.get('/:id', MatTratController.getById);
router.post('/', MatTratController.create);
router.put('/:id', MatTratController.update);
router.delete('/:id', MatTratController.delete);

module.exports = router;
