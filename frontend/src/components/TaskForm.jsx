import React, { useState } from 'react';

function TaskForm({ onClose, onAdd }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('todo');

  function handleSubmit(e) {
    e.preventDefault();
    if (!title.trim()) {
      alert('Title is required');
      return;
    }
    onAdd({ title, description, status });
    setTitle('');
    setDescription('');
    setStatus('todo');
  }

  return (
    <div className="modal-backdrop" onMouseDown={onClose}>
      <div className="modal" onMouseDown={e => e.stopPropagation()}>
        <h3>Add New Task</h3>
        <form className="task-form" onSubmit={handleSubmit}>
          <label>
            <span>Title</span>
            <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Task title" />
          </label>
          <label>
            <span>Description</span>
            <textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Details (optional)" />
          </label>
          <label>
            <span>Status</span>
            <select value={status} onChange={e => setStatus(e.target.value)}>
              <option value="todo">To Do</option>
              <option value="inprogress">In Progress</option>
              <option value="done">Done</option>
            </select>
          </label>

          <div className="modal-actions">
            <button type="submit" className="btn">Add Task</button>
            <button type="button" className="btn btn-ghost" onClick={onClose}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default TaskForm;
