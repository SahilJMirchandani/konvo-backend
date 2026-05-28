const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { getProjects, createProject, deleteProject } = require('../controllers/projectsController');

router.get('/', auth, getProjects);
router.post('/', auth, createProject);
router.delete('/:id', auth, deleteProject);

module.exports = router;
