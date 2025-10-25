import React from 'react';

function TaskCard({ task, setDraggingId, onRemove }) {
  function handleDragStart(e) {
    e.dataTransfer.setData('text/plain', String(task.id));
    setDraggingId(task.id);
  }

  function handleDragEnd() {
    setDraggingId(null);
  }

  return (
    <div
      className="task-card"
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="task-main">
        <h3 className="task-title">{task.title}</h3>
        <p className="task-desc">{task.description}</p>
      </div>
      <div className="task-actions">
        <button className="btn btn-sm" onClick={() => alert('Edit not implemented (frontend prototype)')}>Edit</button>
        <button className="btn btn-danger btn-sm" onClick={onRemove}>Delete</button>
      </div>
    </div>
  );
}

export default TaskCard;
