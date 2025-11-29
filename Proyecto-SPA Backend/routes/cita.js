const express = require('express');
const router = express.Router();
const CitaController = require('../controllers/citaController');
const { authenticateToken, requireRole, requireOwnershipOrAdminByClient, requireOwnershipOrAdminCita} = require('../middleware/auth');

router.get('/', authenticateToken,requireRole('admin'),CitaController.getAll);

router.get('/citasfiltro/:periodo',authenticateToken,requireRole('admin'),CitaController.getByPeriodo);
router.get('/citasUserP/:id', authenticateToken,requireOwnershipOrAdminByClient,CitaController.getByClientePasadas);
router.get('/citasUserF/:id', authenticateToken,requireOwnershipOrAdminByClient,CitaController.getByClienteFuturas);

//router.get('/:id',authenticateToken, requireOwnershipOrAdminCita, CitaController.getById);
router.post('/',authenticateToken, CitaController.create);
//router.put('/:id',authenticateToken,requireOwnershipOrAdminCita, CitaController.update);
router.delete('/:id',authenticateToken,requireOwnershipOrAdminCita, CitaController.delete);

module.exports = router;
