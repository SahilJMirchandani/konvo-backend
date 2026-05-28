const express = require('express');
const router = express.Router({ mergeParams: true });
const auth = require('../middleware/auth');
const { getTasks, createTask, toggleTask, deleteTask } = require('../controllers/tasksController');

router.get('/', auth, getTasks);
router.post('/', auth, createTask);
router.patch('/:taskId', auth, toggleTask);
router.delete('/:taskId', auth, deleteTask);

module.exports = router;