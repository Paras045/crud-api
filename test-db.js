require("dotenv").config();

const assert = require("assert");
const { pool, initializeDatabase } = require("./database");

async function testDatabase() {
    try {
        await initializeDatabase();

        const result = await pool.query(`
            SELECT column_name
            FROM information_schema.columns
            WHERE table_name = 'tasks'
            ORDER BY ordinal_position
        `);

        const columns = result.rows.map(
            ({ column_name }) => column_name
        );

        assert.deepStrictEqual(
            columns,
            ["id", "title", "done"]
        );

        console.log("✅ PostgreSQL database test passed!");
    } catch (error) {
        console.error("❌ Database test failed:", error.message);
        process.exitCode = 1;
    } finally {
        await pool.end();
    }
}

testDatabase();
