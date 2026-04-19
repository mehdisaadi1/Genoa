const express = require('express');
const router = express.Router();
const statsController = require('../controllers/statsController');
const authMiddleware = require('../middlewares/auth');

router.use(authMiddleware(['Admin', 'Editor', 'Reader']));

router.get('/', statsController.getStats);

module.exports = router;
