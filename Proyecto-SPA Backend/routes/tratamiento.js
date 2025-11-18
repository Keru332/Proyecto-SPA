const express = require('express');
const router = express.Router();
const TratamientoController = require('../controllers/tratamientoController');
const { authenticateToken, requireRole } = require('../middleware/auth');

router.get('/mas-popular', TratamientoController.getMasPopular);

router.get('/', TratamientoController.getAll);
router.get('/:id', TratamientoController.getById);
router.post('/',authenticateToken,requireRole('admin'), TratamientoController.create);
router.put('/:id',authenticateToken,requireRole('admin'), TratamientoController.update);
router.delete('/:id',authenticateToken,requireRole('admin'), TratamientoController.delete);

module.exports = router;
