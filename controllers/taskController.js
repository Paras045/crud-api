const taskModel = require("../models/taskModel");

// Get all tasks
const getAllTasks = async (req, res, next) => {
    try {
        const tasks = await taskModel.getAllTasks();
        res.json(tasks);
    } catch (error) {
        next(error);
    }
};

// Get one task by ID
const getTaskById = async (req, res, next) => {
    try {
        const task = await taskModel.getTaskById(req.params.id);

        if (!task) {
            return res.status(404).json({
                error: `Task ${req.params.id} not found`
            });
        }

        res.json(task);
    } catch (error) {
        next(error);
    }
};

// Create a task
const createTask = async (req, res, next) => {
    try {
        const { title } = req.body;

        if (typeof title !== "string" || title.trim() === "") {
            return res.status(400).json({
                error: "Title must be a non-empty string"
            });
        }

        const task = await taskModel.createTask(title.trim(), false);

        res.status(201).json(task);
    } catch (error) {
        next(error);
    }
};

// Update a task
const updateTask = async (req, res, next) => {
    try {
        const { title, done } = req.body;
        const id = req.params.id;

        if (title === undefined && done === undefined) {
            return res.status(400).json({
                error: "Title or done is required"
            });
        }

        if (
            title !== undefined &&
            (typeof title !== "string" || title.trim() === "")
        ) {
            return res.status(400).json({
                error: "Title must be a non-empty string"
            });
        }

        if (done !== undefined && typeof done !== "boolean") {
            return res.status(400).json({
                error: "Done must be true or false"
            });
        }

        let task;

        if (title !== undefined && done !== undefined) {
            task = await taskModel.updateTask(
                title.trim(),
                done,
                id
            );
        } else if (title !== undefined) {
            task = await taskModel.updateTitle(
                title.trim(),
                id
            );
        } else {
            task = await taskModel.updateDone(done, id);
        }

        if (!task) {
            return res.status(404).json({
                error: `Task ${id} not found`
            });
        }

        res.status(200).json(task);
    } catch (error) {
        next(error);
    }
};

// Delete a task
const deleteTask = async (req, res, next) => {
    try {
        const id = req.params.id;
        const deletedCount = await taskModel.deleteTask(id);

        if (deletedCount === 0) {
            return res.status(404).json({
                error: `Task ${id} not found`
            });
        }

        res.status(204).send();
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getAllTasks,
    getTaskById,
    createTask,
    updateTask,
    deleteTask
};
