const { pool } = require("../database");

// Get all tasks
async function getAllTasks() {
    const result = await pool.query(
        "SELECT * FROM tasks ORDER BY id"
    );

    return result.rows;
}

// Get one task by ID
async function getTaskById(id) {
    const result = await pool.query(
        "SELECT * FROM tasks WHERE id = $1",
        [id]
    );

    return result.rows[0];
}

// Create a task
async function createTask(title, done) {
    const result = await pool.query(
        "INSERT INTO tasks (title, done) VALUES ($1, $2) RETURNING *",
        [title, done]
    );

    return result.rows[0];
}

// Update only the title
async function updateTitle(title, id) {
    const result = await pool.query(
        "UPDATE tasks SET title = $1 WHERE id = $2 RETURNING *",
        [title, id]
    );

    return result.rows[0];
}

// Update only the done status
async function updateDone(done, id) {
    const result = await pool.query(
        "UPDATE tasks SET done = $1 WHERE id = $2 RETURNING *",
        [done, id]
    );

    return result.rows[0];
}

// Update both title and done status
async function updateTask(title, done, id) {
    const result = await pool.query(
        "UPDATE tasks SET title = $1, done = $2 WHERE id = $3 RETURNING *",
        [title, done, id]
    );

    return result.rows[0];
}

// Delete a task
async function deleteTask(id) {
    const result = await pool.query(
        "DELETE FROM tasks WHERE id = $1",
        [id]
    );

    return result.rowCount;
}

module.exports = {
    getAllTasks,
    getTaskById,
    createTask,
    updateTitle,
    updateDone,
    updateTask,
    deleteTask
};
