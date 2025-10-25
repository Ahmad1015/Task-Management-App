const express = require('express');
const pool = require('../db');
const authenticateToken = require('../middleware/auth');
const router = express.Router();

// Apply authentication middleware to all task routes
router.use(authenticateToken);

// Get all tasks for the authenticated user
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM tasks WHERE user_id = $1 ORDER BY id DESC',
      [req.user.id]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add a task
router.post('/', async (req, res) => {
  const { title, description, status } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO tasks (title, description, status, user_id) VALUES ($1, $2, $3, $4) RETURNING *',
      [title, description || '', status || 'todo', req.user.id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update a task
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { title, description, status, completed } = req.body;
  try {
    const result = await pool.query(
      'UPDATE tasks SET title = COALESCE($1, title), description = COALESCE($2, description), status = COALESCE($3, status), completed = COALESCE($4, completed) WHERE id = $5 AND user_id = $6 RETURNING *',
      [title, description, status, completed, id, req.user.id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Task not found or unauthorized' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete a task
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      'DELETE FROM tasks WHERE id = $1 AND user_id = $2 RETURNING id',
      [id, req.user.id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Task not found or unauthorized' });
    }
    res.json({ message: 'Task deleted ✅' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
