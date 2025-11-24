const express = require('express');
const router = express.Router();
const CategoriaController = require('../controllers/categoriaController');
const { authenticateToken, requireRole } = require('../middleware/auth');

router.get('/', CategoriaController.getAll);
router.get('/:id', CategoriaController.getById);
router.post('/',authenticateToken,requireRole('admin'), CategoriaController.create);
router.put('/:id',authenticateToken,requireRole('admin'), CategoriaController.update);
router.delete('/:id',authenticateToken,requireRole('admin'), CategoriaController.delete);

module.exports = router;
