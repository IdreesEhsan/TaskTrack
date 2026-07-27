import express from 'express';
import { protect } from '../middleware/auth.js';
import {
    getTasks,
    getTask,
    createTask,
    updateTask,
    deleteTask,
} from '../controllers/taskController.js'

const router = express.Router();

// Every route below this line requires a valid JWT. protect() runs first; if it calls next(), the actual handler runs.
router.use(protect);

router.route('/')
    .get(getTasks) // GET /api/tasks
    .post(createTask); // POST /api/tasks

router.route('/:id')
    .get(getTask)       // GET /api/tasks/:id
    .put(updateTask)    // PUT /api/tasks/:id
    .delete(deleteTask); // DELETE /api/tasks/:id

export default router;