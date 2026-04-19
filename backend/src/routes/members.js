const express = require('express');
const router = express.Router();
const memberController = require('../controllers/memberController');
const authMiddleware = require('../middlewares/auth');

// All member routes require at least authenticated user (Reader)
router.use(authMiddleware(['Admin', 'Editor', 'Reader']));

router.get('/', memberController.getAllMembers);
router.get('/:id', memberController.getMember);

// Creation, modification, deletion require Admin or Editor
router.post('/', authMiddleware(['Admin', 'Editor']), memberController.createMember);
router.put('/:id', authMiddleware(['Admin', 'Editor']), memberController.updateMember);
router.delete('/:id', authMiddleware(['Admin', 'Editor']), memberController.deleteMember);

module.exports = router;
