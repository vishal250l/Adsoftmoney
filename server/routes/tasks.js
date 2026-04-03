const express = require('express');
const router = express.Router();
const { getTasks, completeTask } = require('../controllers/tasksController');
const { protect } = require('../middleware/auth');
router.get('/', protect, getTasks);
router.post('/complete', protect, completeTask);
module.exports = router;
