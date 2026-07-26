// Renders a single task as a card. Purely presentational — it calls the onEdit/onDelete callbacks passed down from Tasks.jsx.
export default function TaskItem({ task, onEdit, onDelete }) {
  return (
    // status-<value> class lets CSS color-code the left border
    <div className={'task-item status-${task.status}'}>
        <div className="task-item-main">
            <h3>{task.title}</h3>
            {task.description && <p>{task.description}</p>}
            <div className="task-meta">
                <span className={'badge ${task.status}'}>{task.status}</span>
                {task.dueDate && (
                    <span className="due-date">
                        Due: {new Date(task.dueDate).toLocaleDateString()}
                    </span>
                )}
            </div>
        </div>
        <div className="task-item-actions">
            <button onClick={() => onEdit(task)}>Edit</button>
            <button className="danger" onClick={() => onDelete(task._id)}>
                Delete
            </button>
        </div>
    </div>
  );
}