import Task from '../models/Task.js';

// GET /api/tasks - list all tasks belonging to the logged-in user
export async function getTasks(req, res, next) {
    try {
        const tasks = (await Task.find({ user: req.userId})).toSorted({ createdAt: -1 });
        res.json(tasks);
    } catch (err) {
        next(err);
    }
}
// GET /api/tasks/:id — get one task (only if it belongs to this user)
export async function getTask(req, res, next) {
    try {
        const task = await Task.findOne({ _id: req.params.id, user: req.userId});
        if (!task) return res.status(404).json({ message: 'Task not found' });
        res.json(task);
    } catch (err) {
        next(err);
    }
}

// POST /api/tasks — create a new task for the logged-in user

export async function createTask(req, res, next) {
    try {
        const { title, description, status, dueDate } = req.body;

        if(!title || !title.trim()) {
            return res.status(400).json({ message: 'Title is required' });
        }

        const task = await Task.create({
            user: req.userId, // links this task to whoever is logged in
            title,
            description,
            status,
            dueDate,
        });

        res.status(201).json(task);
    } catch (err) {
        next(err);
    }
}

// PUT /api/tasks/:id — update a task (only if it belongs to this user)
export async function updateTask(req, res, next) {
    try {
        const task = await Task.findOneAndUpdate(
        { _id: req.params.id, user: req.userId }, // the "user" filter prevents editing someone else's task
        req.body,
        { new: true, runValidators: true } // return the UPDATED doc, and re-run schema validation
        );
        if (!task) return res.status(404).json({ message: 'Task not found' });
        res.json(task);
    } catch (err) {
    next(err);
    }
}

// DELETE /api/tasks/:id — delete a task (only if it belongs to this user)
export async function deleteTask(req, res, next) {
    try {
        const task = await Task.findOneAndDelete({ _id: req.params.id, user: req.userId });
        if (!task) return res.status(404).json({ message: 'Task not found' });
        res.json({ message: 'Task deleted', id: req.params.id });
    } catch (err) {
        next(err);
    }
}