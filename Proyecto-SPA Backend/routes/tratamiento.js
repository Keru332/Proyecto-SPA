const express = require('express');
const router = express.Router();
const TratamientoController = require('../controllers/tratamientoController');
const { authenticateToken, requireRole } = require('../middleware/auth');

router.get('/mas-popular', TratamientoController.getMasPopular);

router.get('/', TratamientoController.getAll);
router.get('/:id', TratamientoController.getById);
router.post('/',authenticateToken, TratamientoController.create);
router.put('/:id',authenticateToken, TratamientoController.update);
router.delete('/:id',authenticateToken, TratamientoController.delete);

module.exports = router;
