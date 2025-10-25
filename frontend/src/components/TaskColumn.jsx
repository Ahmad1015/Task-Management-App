import React from 'react';
import TaskCard from './TaskCard';

function TaskColumn({ columnKey, title, tasks, onDropTask, setDraggingId, draggingId, onRemoveTask }) {
  function handleDragOver(e) {
    e.preventDefault(); // allow drop
    e.dataTransfer.dropEffect = 'move';
  }

  function handleDrop(e) {
    e.preventDefault();
    const id = e.dataTransfer.getData('text/plain');
    const taskId = id ? parseInt(id, 10) : null;
    if (taskId) {
      onDropTask(taskId);
      setDraggingId(null);
    }
  }

  return (
    <div
      className={`task-column ${draggingId ? 'drag-active' : ''}`}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <h2 className="column-title">{title}</h2>
      <div className="tasks-list">
        {tasks.length === 0 && <p className="empty-text">No tasks</p>}
        {tasks.map(task => (
          <TaskCard
            key={task.id}
            task={task}
            setDraggingId={setDraggingId}
            onRemove={() => onRemoveTask(task.id)}
          />
        ))}
      </div>
    </div>
  );
}

export default TaskColumn;
