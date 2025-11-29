const express = require('express');
const router = express.Router();
const userController = require('../controllers/usersController');
const { authenticateToken, requireRole, requireOwnershipOrAdminByUser} = require('../middleware/auth');

router.get('/',authenticateToken,requireRole('admin'), userController.getAll);
router.get('/:id',authenticateToken,requireOwnershipOrAdminByUser, userController.getById);
router.post('/register',userController.register); 
router.post('/login', userController.login);
//router.put('/:id',authenticateToken, userController.update);
router.put('/:id/password',authenticateToken,requireOwnershipOrAdminByUser, userController.updatePassword);
//router.delete('/:id',authenticateToken,requireRole('admin'), userController.delete);
router.put('/:id/profile', authenticateToken,requireOwnershipOrAdminByUser, userController.updateProfile);

module.exports = router;
