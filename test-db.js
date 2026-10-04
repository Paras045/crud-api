const db = require('./database');
const assert = require('assert');

const columns = db.prepare('PRAGMA table_info(tasks)').all().map(({ name }) => name);
assert.deepStrictEqual(columns, ['id', 'title', 'done']);

console.log("✅ Database test complete! 'tasks.db' contains the expected tasks table.");
