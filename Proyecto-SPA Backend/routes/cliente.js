const express = require('express');
const router = express.Router();
const ClienteController = require('../controllers/clienteController');
const { authenticateToken, requireRole } = require('../middleware/auth');

router.get('/', authenticateToken, ClienteController.getAll);
router.get('/:id', authenticateToken, ClienteController.getById);
router.post('/', authenticateToken, ClienteController.create);
router.put('/:id', authenticateToken, ClienteController.update);
router.delete('/:id', authenticateToken, ClienteController.delete);

module.exports = router;
