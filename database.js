const Database = require('better-sqlite3');
const path = require('path');

const db = new Database(path.join(__dirname, 'tasks.db'));

// Create the tasks table schema right away if it's missing
db.exec(`
  CREATE TABLE IF NOT EXISTS tasks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    done INTEGER NOT NULL DEFAULT 0

    
  )
`);

// Insert a sample task if the table is empty
db.exec(`
  INSERT INTO tasks (title, done) VALUES ('Task 1',0),('Task 2',0),('Task 3',0) WHERE NOT EXISTS (SELECT 1 FROM tasks);
  
`);

db.prepare(`SELECT COUNT(*) FROM tasks;`)

console.log("✅ Connection verified. 'tasks.db' is ready for operations.");

module.exports = db;
