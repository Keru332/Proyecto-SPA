const express = require('express');
const router = express.Router();
const PaqueteController = require('../controllers/paqueteController');
const { authenticateToken, requireRole } = require('../middleware/auth');

router.get('/',authenticateToken,PaqueteController.getAll);
router.get('/:id',authenticateToken,PaqueteController.getById);
router.post('/',authenticateToken,requireRole('admin'), PaqueteController.create);
router.put('/:id',authenticateToken,requireRole('admin'), PaqueteController.update);
router.delete('/:id',authenticateToken,requireRole('admin'), PaqueteController.delete);

module.exports = router;
