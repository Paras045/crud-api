const taskModel = require("../models/taskModel");

const getAllTasks = (req, res) => {
    const tasks = taskModel.getAllTasks.all();
    res.json(tasks);
};

const getTaskById = (req, res) => {
    const task = taskModel.getTaskById.get(req.params.id);

    if (!task) {
        return res.status(404).json({
            error: `Task ${req.params.id} not found`
        });
    }

    res.json(task);
};

const createTask = (req, res) => {
    const { title } = req.body;

    if (typeof title !== "string" || title.trim() === "") {
        return res.status(400).json({
            error: "Title must be a non-empty string"
        });
    }

    const result = taskModel.createTask.run(title.trim(), 0);

    const task = taskModel.getTaskById.get(
        result.lastInsertRowid
    );

    res.status(201).json(task);
};

const updateTask = (req, res) => {
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

    if (
        done !== undefined &&
        typeof done !== "boolean"
    ) {
        return res.status(400).json({
            error: "Done must be true or false"
        });
    }

    let result;

    if (title !== undefined && done !== undefined) {
        result = taskModel.updateTask.run(
            title.trim(),
            done ? 1 : 0,
            id
        );
    } else if (title !== undefined) {
        result = taskModel.updateTitle.run(
            title.trim(),
            id
        );
    } else {
        result = taskModel.updateDone.run(
            done ? 1 : 0,
            id
        );
    }

    if (result.changes === 0) {
        return res.status(404).json({
            error: `Task ${id} not found`
        });
    }

    const task = taskModel.getTaskById.get(id);

    res.status(200).json(task);
};

const deleteTask = (req, res) => {
    const id = req.params.id;

    const result = taskModel.deleteTask.run(id);

    if (result.changes === 0) {
        return res.status(404).json({
            error: `Task ${id} not found`
        });
    }

    res.status(204).send();
};

module.exports = {
    getAllTasks,
    getTaskById,
    createTask,
    updateTask,
    deleteTask
};