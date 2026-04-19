const express = require('express');
const router = express.Router();
const relationController = require('../controllers/relationController');
const authMiddleware = require('../middlewares/auth');

router.use(authMiddleware(['Admin', 'Editor', 'Reader']));

// Relations (Parent-Child)
router.post('/parent-child', authMiddleware(['Admin', 'Editor']), relationController.createParentChild);
router.delete('/parent-child/:id', authMiddleware(['Admin', 'Editor']), relationController.deleteParentChild);

// Couples
router.post('/couple', authMiddleware(['Admin', 'Editor']), relationController.createCouple);
router.delete('/couple/:id', authMiddleware(['Admin', 'Editor']), relationController.deleteCouple);

module.exports = router;
