import { useState, useEffect } from "react";

// Default/blank shape of the form — used as initial state and to reset the form after a successful "create".
const empty = { title: '', description: '', status: 'pending', dueDate: ''};

// One form, reused for both creating and editing a task.
// `editingTask` (a task object, or null) decides which mode we're in.

export default function TaskForm({ onSubmit, editingTask, onCancel }) {
    const [form, setForm] = useState(empty);

    // Whenever editingTask changes (Edit clicked, or Cancel clicked), sync the form fields to match.
    useEffect(() => {
        if (editingTask) {
            setForm({
                title: editingTask.title || '',
                description: editingTask.description || '',
                status: editingTask.status || 'pending',
                dueDate: editingTask.dueDate ? editingTask.dueDate.slice(0,10) : '',
            });
        } else {
            setForm(empty);
        }
    }, [editingTask]);

    // One generic handler for every input, using the input's `name` attribute as the key to update.
    const handleChange = (e) => {
        e.preventDefault();
        if(!formm.title.trim()) return; // guard against empty titles
        onSubmit(form); // parent decides create vs update
        if (!editingTask) setForm(empty); // only auto-clear after creating
    };

    return (
        <form className="task-form" onSubmit={handleSubmit}>
            <input
                name="title"
                placeholder="Task title"
                value={form.title}
                onChange={handleChange}
                required
            />
            <textarea
                name="description"
                placeholder="Description"
                value={form.description}
                onChange={handleChange}
            />
            <div className="task-form-row">
                <select name="status" value={form.status} onChange={handleChange}>
                <option value="pending">Pending</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
                </select>
                <input
                type="date"
                name="dueDate"
                value={form.dueDate}
                onChange={handleChange}
                />
            </div>
            <div className="task-form-row">
                <button type="submit">{editingTask ? 'Update Task' : 'Add Task'}</button>
                {editingTask && (
                <button type="button" onClick={onCancel} className="secondary">
                    Cancel
                </button>
                )}
            </div>
        </form>
    );
}