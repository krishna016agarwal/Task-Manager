import { useEffect, useState } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import Message from '../components/Message';

const Dashboard = () => {
  const { user } = useAuth();

  const [tasks, setTasks] = useState([]);

  const [form, setForm] = useState({
    title: '',
    description: '',
    status: 'pending',
    priority: 'medium'
  });

  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const fetchTasks = async () => {
    try {
      const response = await api.get('/tasks');
      setTasks(response.data.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch tasks');
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const resetForm = () => {
    setForm({
      title: '',
      description: '',
      status: 'pending',
      priority: 'medium'
    });

    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage('');
    setError('');

    try {
      if (editingId) {
        const response = await api.patch(`/tasks/${editingId}`, form);
        setMessage(response.data.message);
      } else {
        const response = await api.post('/tasks', form);
        setMessage(response.data.message);
      }

      resetForm();
      fetchTasks();
    } catch (err) {
      setError(err.response?.data?.message || 'Operation failed');
    }
  };

  const handleEdit = (task) => {
    setEditingId(task._id);

    setForm({
      title: task.title,
      description: task.description || '',
      status: task.status,
      priority: task.priority
    });
  };

  const handleDelete = async (id) => {
    setMessage('');
    setError('');

    try {
      const response = await api.delete(`/tasks/${id}`);
      setMessage(response.data.message);
      fetchTasks();
    } catch (err) {
      setError(err.response?.data?.message || 'Delete failed');
    }
  };

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div>
          <h1>Dashboard</h1>

          <p>
            Welcome, {user?.name}. Your role is <b>{user?.role}</b>.
          </p>

          {user?.role === 'admin' && (
            <p className="admin-note">
              Admin can see all users tasks.
            </p>
          )}
        </div>
      </div>

      <Message type="success" text={message} />
      <Message type="error" text={error} />

      <div className="grid-layout">
        <form className="task-form" onSubmit={handleSubmit}>
          <h2>{editingId ? 'Update Task' : 'Create Task'}</h2>

          <label>Title</label>
          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="Task title"
            required
          />

          <label>Description</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Task description"
            rows="4"
          />

          <label>Status</label>
          <select name="status" value={form.status} onChange={handleChange}>
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>

          <label>Priority</label>
          <select name="priority" value={form.priority} onChange={handleChange}>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>

          <button className="btn btn-primary full" type="submit">
            {editingId ? 'Update Task' : 'Create Task'}
          </button>

          {editingId && (
            <button
              type="button"
              className="btn btn-secondary full"
              onClick={resetForm}
            >
              Cancel Edit
            </button>
          )}
        </form>

        <div className="task-list">
          <h2>Tasks</h2>

          {tasks.length === 0 ? (
            <p>No tasks found.</p>
          ) : (
            tasks.map((task) => (
              <div className="task-card" key={task._id}>
                <div className="task-top">
                  <h3>{task.title}</h3>

                  <span className={`badge ${task.priority}`}>
                    {task.priority}
                  </span>
                </div>

                <p>{task.description || 'No description'}</p>

                <span className="status">
                  Status: {task.status}
                </span>

                {task.createdBy && (
                  <p className="small">
                    Created by: {task.createdBy.name} ({task.createdBy.role})
                  </p>
                )}

                <div className="task-actions">
                  <button
                    className="btn btn-secondary"
                    onClick={() => handleEdit(task)}
                  >
                    Edit
                  </button>

                  <button
                    className="btn btn-danger"
                    onClick={() => handleDelete(task._id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;