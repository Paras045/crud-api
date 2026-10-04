const db = require("../database");

const getAllTasks = db.prepare(
    "SELECT * FROM tasks"
);

const getTaskById = db.prepare(
    "SELECT * FROM tasks WHERE id = ?"
);

const createTask = db.prepare(
    "INSERT INTO tasks (title, done) VALUES (?, ?)"
);

const updateTitle = db.prepare(
    "UPDATE tasks SET title = ? WHERE id = ?"
);

const updateDone = db.prepare(
    "UPDATE tasks SET done = ? WHERE id = ?"
);

const updateTask = db.prepare(
    "UPDATE tasks SET title = ?, done = ? WHERE id = ?"
);

const deleteTask = db.prepare(
    "DELETE FROM tasks WHERE id = ?"
);

module.exports = {
    getAllTasks,
    getTaskById,
    createTask,
    updateTitle,
    updateDone,
    updateTask,
    deleteTask
};