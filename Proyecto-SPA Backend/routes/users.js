const express = require('express');
const router = express.Router();
const userController = require('../controllers/usersController');
const { authenticateToken, requireRole } = require('../middleware/auth');

router.get('/',authenticateToken, userController.getAll);
router.get('/:id',authenticateToken, userController.getById);
router.post('/register',userController.register); 
router.post('/login', userController.login);
router.put('/:id',authenticateToken, userController.update);
router.put('/:id/password',authenticateToken, userController.updatePassword);
router.delete('/:id',authenticateToken,requireRole('admin'), userController.delete);
router.put('/:id/profile', authenticateToken, userController.updateProfile);

module.exports = router;
