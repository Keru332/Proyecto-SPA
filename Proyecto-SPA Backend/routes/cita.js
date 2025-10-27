const express = require('express');
const router = express.Router();
const CitaController = require('../controllers/citaController');
const { authenticateToken, requireRole } = require('../middleware/auth');

router.get('/', authenticateToken,CitaController.getAll);
router.get('/:id',authenticateToken, CitaController.getById);
router.post('/',authenticateToken, CitaController.create);
router.put('/:id',authenticateToken, CitaController.update);
router.delete('/:id',authenticateToken, CitaController.delete);

module.exports = router;
