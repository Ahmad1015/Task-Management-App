import React, { useState, useEffect } from 'react';
import TaskColumn from './components/TaskColumn';
import TaskForm from './components/TaskForm';
import Auth from './components/Auth';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

function App() {
  // Auth state
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Modal visibility
  const [showModal, setShowModal] = useState(false);

  // Tasks state
  const [tasks, setTasks] = useState([]);

  // Drag state (optional, for visual feedback)
  const [draggingId, setDraggingId] = useState(null);

  const columns = [
    { key: 'todo', title: 'To Do' },
    { key: 'inprogress', title: 'In Progress' },
    { key: 'done', title: 'Done' },
  ];

  // Check for existing token on mount
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    if (storedToken && storedUser) {
      // Verify token is still valid
      fetch(`${API_URL}/auth/verify`, {
        headers: {
          'Authorization': `Bearer ${storedToken}`
        }
      })
      .then(res => {
        if (res.ok) {
          setToken(storedToken);
          setUser(JSON.parse(storedUser));
        } else {
          // Token invalid, clear storage
          localStorage.removeItem('token');
          localStorage.removeItem('user');
        }
      })
      .catch(err => {
        console.error('Token verification failed:', err);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      })
      .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  // Fetch tasks when user is authenticated
  useEffect(() => {
    if (token) {
      fetchTasks();
    }
  }, [token]);

  async function fetchTasks() {
    try {
      const response = await fetch(`${API_URL}/tasks`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setTasks(data);
      } else {
        console.error('Failed to fetch tasks');
      }
    } catch (err) {
      console.error('Error fetching tasks:', err);
    }
  }

  // Add a new task
  async function addTask({ title, description, status }) {
    try {
      const response = await fetch(`${API_URL}/tasks`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          title: title.trim() || 'Untitled',
          description: description.trim() || '',
          status: status || 'todo'
        })
      });

      if (response.ok) {
        const newTask = await response.json();
        setTasks(prev => [newTask, ...prev]);
      } else {
        alert('Failed to add task');
      }
    } catch (err) {
      console.error('Error adding task:', err);
      alert('Error adding task');
    }
  }

  // Handler to update a task's status (used on drop)
  async function updateTaskStatus(taskId, newStatus) {
    try {
      const response = await fetch(`${API_URL}/tasks/${taskId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (response.ok) {
        setTasks(prev => prev.map(t => (t.id === taskId ? { ...t, status: newStatus } : t)));
      } else {
        alert('Failed to update task');
      }
    } catch (err) {
      console.error('Error updating task:', err);
      alert('Error updating task');
    }
  }

  // Remove task
  async function removeTask(taskId) {
    try {
      const response = await fetch(`${API_URL}/tasks/${taskId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        setTasks(prev => prev.filter(t => t.id !== taskId));
      } else {
        alert('Failed to delete task');
      }
    } catch (err) {
      console.error('Error deleting task:', err);
      alert('Error deleting task');
    }
  }

  // Handle login
  function handleLogin(userData, userToken) {
    setUser(userData);
    setToken(userToken);
  }

  // Simple logout
  function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setToken(null);
    setTasks([]);
  }

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <p>Loading...</p>
      </div>
    );
  }

  if (!user) {
    return <Auth onLogin={handleLogin} />;
  }

  return (
    <div className="app-container">
      <header className="app-header">
        <div className="header-left">
          <h1>Task Manager Dashboard</h1>
          <p className="subtitle">Welcome, {user.username}</p>
        </div>

        <div className="header-right">
          <button className="btn" onClick={() => setShowModal(true)}>+ Add Task</button>
          <button className="btn btn-ghost" onClick={logout}>Logout</button>
        </div>
      </header>

      <main className="board-wrapper">
        <div className="board">
          {columns.map(col => (
            <TaskColumn
              key={col.key}
              columnKey={col.key}
              title={col.title}
              tasks={tasks.filter(t => t.status === col.key)}
              onDropTask={(taskId) => updateTaskStatus(taskId, col.key)}
              setDraggingId={setDraggingId}
              draggingId={draggingId}
              onRemoveTask={removeTask}
            />
          ))}
        </div>
      </main>

      {showModal && (
        <TaskForm
          onClose={() => setShowModal(false)}
          onAdd={(data) => { addTask(data); setShowModal(false); }}
        />
      )}

      <footer className="app-footer">
        <small>Task Manager • Authenticated with PostgreSQL</small>
      </footer>
    </div>
  );
}

export default App;
