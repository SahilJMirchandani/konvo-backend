const pool = require('../config/db');

const getProjects = async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM projects WHERE user_id = $1 ORDER BY created_at DESC',
      [req.user.id]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const createProject = async (req, res) => {
  const { title, description } = req.body;
  if (!title) return res.status(400).json({ message: 'Title is required' });
  try {
    const result = await pool.query(
      'INSERT INTO projects (title, description, user_id) VALUES ($1, $2, $3) RETURNING *',
      [title, description, req.user.id]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const deleteProject = async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM projects WHERE id = $1 AND user_id = $2', [id, req.user.id]);
    res.json({ message: 'Project deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getProjects, createProject, deleteProject };