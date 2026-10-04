const Database = require("better-sqlite3");
const path = require("path");

const db = new Database(
    path.join(__dirname, "tasks.db")
);

// Create tasks table if it doesn't exist
db.exec(`
    CREATE TABLE IF NOT EXISTS tasks (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        done INTEGER NOT NULL DEFAULT 0
    )
`);

// Insert sample tasks only when the table is empty
db.exec(`
    INSERT INTO tasks (title, done)
    SELECT 'TASK 1', 0
    WHERE NOT EXISTS (SELECT 1 FROM tasks)

    UNION ALL

    SELECT 'TASK 2', 0
    WHERE NOT EXISTS (SELECT 1 FROM tasks)

    UNION ALL

    SELECT 'TASK 3', 0
    WHERE NOT EXISTS (SELECT 1 FROM tasks);
`);

console.log("✅ Connection verified. 'tasks.db' is ready for operations.");

module.exports = db;