const express = require('express');
const router = express.Router();
const userController = require('../controllers/usersController');
const { authenticateToken, requireRole } = require('../middleware/auth');

router.get('/',authenticateToken, userController.getAll);
router.get('/:id',authenticateToken, userController.getById);
router.post('/register',userController.register);  // Nueva ruta de registro
router.post('/login', userController.login);
router.put('/:id',authenticateToken, userController.update);
router.put('/:id/password',authenticateToken, userController.updatePassword);
router.delete('/:id',authenticateToken, userController.delete);

module.exports = router;
