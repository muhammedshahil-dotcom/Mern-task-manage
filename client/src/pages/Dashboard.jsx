import React, { useEffect, useState } from 'react';
import api from '../api/api';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  if (!token) navigate('/login');

  // ✅ Fetch tasks from API
  const fetchTasks = async () => {
    try {
      const res = await api.get('/tasks', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTasks(res.data);
    } catch {
      setError('Failed to fetch tasks');
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // ✅ Add new task
  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/tasks', { title }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTasks((prev) => [...prev, res.data]); // update state instantly
      setTitle('');
    } catch {
      setError('Failed to add task');
    }
  };

  // ✅ Toggle task completion
  const handleToggle = async (id) => {
    const task = tasks.find((t) => t._id === id);
    if (!task) return;
    try {
      const res = await api.put(`/tasks/${id}`, { 
        completed: !task.completed, 
        title: task.title 
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTasks((prev) => prev.map((t) => (t._id === id ? res.data : t)));
    } catch {
      setError('Failed to update task');
    }
  };

  // ✅ Delete task instantly
  const handleDelete = async (id) => {
    try {
      await api.delete(`/tasks/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTasks((prev) => prev.filter((t) => t._id !== id)); // remove from state instantly
    } catch {
      setError('Failed to delete task');
    }
  };

  // ✅ Logout
  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className="p-6 max-w-lg mx-auto bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4">Dashboard</h2>
      <button
        onClick={handleLogout}
        className="mb-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
      >
        Logout
      </button>
      {error && <p className="text-red-500">{error}</p>}
      <form onSubmit={handleAdd} className="flex gap-2 mb-4">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="New Task"
          required
          className="flex-1 border rounded px-3 py-2"
        />
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Add
        </button>
      </form>
      <ul>
        {tasks.map((task) => (
          <li
            key={task._id}
            className="flex justify-between items-center border-b py-2"
          >
            <span
              style={{
                textDecoration: task.completed ? 'line-through' : 'none',
                cursor: 'pointer',
              }}
              onClick={() => handleToggle(task._id)}
            >
              {task.title}
            </span>
            <button
              onClick={() => handleDelete(task._id)}
              className="text-red-500 hover:text-red-700"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
