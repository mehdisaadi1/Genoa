const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const authMiddleware = require('../middlewares/auth');

// All admin routes must be protected by Admin role
router.use(authMiddleware(['Admin']));

router.get('/users', adminController.getUsers);
router.post('/users', adminController.createUser);
router.put('/users/:id', adminController.updateUser);
router.put('/users/:id/validate', adminController.validateUser);
router.delete('/users/:id', adminController.deleteUser);

module.exports = router;
