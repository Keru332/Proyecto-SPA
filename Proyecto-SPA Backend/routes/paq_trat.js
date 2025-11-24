const express = require('express');
const router = express.Router();
const PaqTratController = require('../controllers/paq_tratController');
const { authenticateToken, requireRole } = require('../middleware/auth');

router.get('/',authenticateToken,PaqTratController.getAll);
router.get('/:id',authenticateToken,PaqTratController.getById);
router.post('/',authenticateToken,requireRole('admin'), PaqTratController.create);
router.put('/:id',authenticateToken,requireRole('admin'), PaqTratController.update);
router.delete('/:codpaquete/:codtratamiento',authenticateToken,requireRole('admin'), PaqTratController.delete);

module.exports = router;
