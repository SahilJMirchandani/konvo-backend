const pool = require('../config/db');

const getTasks = async (req, res) => {
  const { projectId } = req.params;
  try {
    const result = await pool.query(
      'SELECT * FROM tasks WHERE project_id = $1 ORDER BY created_at DESC',
      [projectId]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const createTask = async (req, res) => {
  const { projectId } = req.params;
  const { title, due_date } = req.body;
  if (!title) return res.status(400).json({ message: 'Title is required' });
  try {
    const result = await pool.query(
      'INSERT INTO tasks (title, status, due_date, project_id) VALUES ($1, $2, $3, $4) RETURNING *',
      [title, 'incomplete', due_date || null, projectId]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const toggleTask = async (req, res) => {
  const { taskId } = req.params;
  const { status } = req.body;
  try {
    const result = await pool.query(
      'UPDATE tasks SET status = $1 WHERE id = $2 RETURNING *',
      [status, taskId]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const deleteTask = async (req, res) => {
  const { taskId } = req.params;
  try {
    await pool.query('DELETE FROM tasks WHERE id = $1', [taskId]);
    res.json({ message: 'Task deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getTasks, createTask, toggleTask, deleteTask };