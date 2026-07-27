import { useState, useEffect } from "react";
import { api } from '../api/api';
import { useAuth } from '../context/AuthContext';
import TaskForm from '../components/TaskForm';
import TaskItem from '../components/TaskItem';

export default function Tasks() {
    const { user, logout } = useAuth();
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [editingTask, setEditingTask] = useState(null);

    const fetchTasks = async () => {
        setLoading(true);
        setError('');
        try {
            const data = await api.get('/tasks');
            setTasks(data);
        } catch (err) {
            setError(err.message || 'Failed to load tasks');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTasks();
    }, []);

    const handleCreateOrUpdate = async (form) => {
        setError('');
        try {
            if (editingTask) {
                const data = await api.put(`/tasks/${editingTask._id}`, form);
                setTasks(tasks.map((t) => (t._id === data._id ? data : t)));
                setEditingTask(null);
            } else {
                const data = await api.post('/tasks', form);
                setTasks([data, ...tasks]);
            }
        } catch (err) {
            setError(err.message || 'Could not save task');
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Delete this task?')) return;
        setError('');
        try {
            await api.delete(`/tasks/${id}`);
            setTasks(tasks.filter((t) => t._id !== id));
        } catch (err) {
            setError(err.message || 'Could not delete task');
        }
    };

    return (
        <div className="tasks-container">
            <header className="tasks-header">
                <h1>TaskTrack</h1>
                <div>
                    <span>Hi, {user?.name}</span>
                    <button onClick={logout} className="secondary">
                        Logout
                    </button>
                </div>
            </header>

            <TaskForm
                onSubmit={handleCreateOrUpdate}
                editingTask={editingTask}
                onCancel={() => setEditingTask(null)}
            />

            {error && <p className="error">{error}</p>}

            {loading ? (
                <p>Loading tasks...</p>
            ) : tasks.length === 0 ? (
                <p>No tasks yet. Add your first one above.</p>
            ) : (
                <div className="task-list">
                    {tasks.map((task) => (
                        <TaskItem
                            key={task._id}
                            task={task}
                            onEdit={setEditingTask}
                            onDelete={handleDelete}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}