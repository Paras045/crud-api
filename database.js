const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL
});

// Initialize the database
async function initializeDatabase() {
    // Create tasks table if it doesn't exist
    await pool.query(`
        CREATE TABLE IF NOT EXISTS tasks (
            id SERIAL PRIMARY KEY,
            title TEXT NOT NULL,
            done BOOLEAN NOT NULL DEFAULT FALSE
        )
    `);

    // Insert sample tasks only when the table is empty
    await pool.query(`
        INSERT INTO tasks (title, done)
        SELECT 'TASK 1', FALSE
        WHERE NOT EXISTS (SELECT 1 FROM tasks)

        UNION ALL

        SELECT 'TASK 2', FALSE
        WHERE NOT EXISTS (SELECT 1 FROM tasks)

        UNION ALL

        SELECT 'TASK 3', FALSE
        WHERE NOT EXISTS (SELECT 1 FROM tasks)
    `);

    console.log("✅ PostgreSQL database is ready.");
}

module.exports = { pool, initializeDatabase };
