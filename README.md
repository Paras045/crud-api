# Task CRUD API

A simple CRUD REST API built with **Node.js, Express.js, and SQLite**.

This project started as an in-memory CRUD API and was upgraded to use a real SQLite database. The API endpoints remain the same, while the data is now stored persistently in SQLite.

## 🚀 Features

- RESTful CRUD API
- SQLite database with `better-sqlite3`
- Persistent task storage
- Automatic database creation
- Automatic `tasks` table creation
- Three sample tasks inserted when the table is empty
- Input validation
- Proper HTTP status codes
- Layered project structure
- Swagger / OpenAPI documentation
- Environment variable configuration
- SQL queries for database operations

---

## 🛠️ Tech Stack

- **Node.js**
- **Express.js**
- **SQLite**
- **better-sqlite3**
- **Swagger UI / OpenAPI**
- **dotenv**

---

## 📁 Project Structure

```text
crud-api/
│
├── controllers/
│   └── taskController.js
│
├── models/
│   └── taskModel.js
│
├── routes/
│   └── taskRoutes.js
│
├── screenshots/
│   └── database.png
│
├── database.js
├── server.js
├── tasks.db
├── .env
├── .gitignore
├── package.json
├── package-lock.json
└── README.md

🗄️ Database
This project uses SQLite for persistent data storage.
SQLite was chosen because it is lightweight and does not require a separate database server. The entire database is stored in a single file.
The database file is:
tasks.db

The database is automatically created when the application starts if it does not already exist.
The tasks table is also automatically created if it does not exist.
Tasks Table
Column	Type	Description
id	INTEGER	Primary key
title	TEXT	Task title
done	INTEGER	Completion status (0 or 1)


Three sample tasks are automatically inserted only when the table is empty.
🔌 API Endpoints
Method	Endpoint	Description
GET	/tasks	Get all tasks
GET	/tasks/:id	Get a task by ID
POST	/tasks	Create a new task
PUT	/tasks/:id	Update a task
DELETE	/tasks/:id	Delete a task


📖 Swagger Documentation
The API includes interactive Swagger/OpenAPI documentation.
After starting the server, open:
http://localhost:3000/docs

Swagger allows you to test all CRUD endpoints directly from the browser.
⚙️ Environment Configuration
The application uses environment variables through dotenv.
Create a .env file in the project root:
PORT=3000

The server uses the configured port and falls back to port 3000 if no port is provided.
const port = process.env.PORT || 3000;

The .env file is excluded from Git using .gitignore.
🚀 Getting Started
1. Clone the repository
git clone https://github.com/Paras045/crud-api.git

2. Enter the project directory
cd crud-api

3. Install dependencies
npm install

4. Create the environment file
Create a .env file:
PORT=3000

5. Start the server
node server.js

You should see:
Server is running on http://localhost:3000

The database will automatically be created if it does not already exist.
🧪 Testing the API
Get all tasks
GET /tasks

Example:
[
  {
    "id": 10,
    "title": "TASK 1",
    "done": 0
  },
  {
    "id": 11,
    "title": "TASK 2",
    "done": 0
  },
  {
    "id": 12,
    "title": "TASK 3",
    "done": 0
  }
]

Get a task by ID
GET /tasks/10

Example response:
{
  "id": 10,
  "title": "TASK 1",
  "done": 0
}

If the task does not exist:
404

{
  "error": "Task 10 not found"
}

Create a task
POST /tasks

Request body:
{
  "title": "Learn SQLite"
}

Successful response:
201 Created

Example:
{
  "id": 13,
  "title": "Learn SQLite",
  "done": 0
}

Update a task
PUT /tasks/13

Request body:
{
  "title": "Learn SQLite",
  "done": true
}

Successful response:
200 OK

Example:
{
  "id": 13,
  "title": "Learn SQLite",
  "done": 1
}

The API accepts true / false from the client and stores the SQLite value as 1 / 0.
Delete a task
DELETE /tasks/13

Successful response:
204 No Content

The response contains no JSON body.
✅ Validation
The API validates incoming requests.
Missing or invalid title
{
  "title": 123
}

Returns:
400 Bad Request

{
  "error": "Title must be a non-empty string"
}

Invalid done value
{
  "done": "true"
}

Returns:
400 Bad Request

{
  "error": "Done must be true or false"
}

Missing task
Requests for a task that does not exist return:
404 Not Found

🧠 SQL Queries
The database was also explored manually using DB Browser for SQLite.
List all tasks
SELECT * FROM tasks;

Show completed tasks
SELECT * FROM tasks
WHERE done = 1;

Count all tasks
SELECT COUNT(*) FROM tasks;

Mark every task as completed
UPDATE tasks
SET done = 1;

Delete all completed tasks
DELETE FROM tasks
WHERE done = 1;

Changes made directly to the SQLite database are reflected immediately when the API reads from the database.
📸 Database Screenshot
The SQLite database was opened using DB Browser for SQLite.
 
The database viewer shows the tasks table with its stored task records.
🔄 Data Persistence
In the original version, tasks were stored in an in-memory JavaScript array:
Client
   ↓
API
   ↓
In-memory array

After connecting SQLite, the architecture became:
Client
   ↓
Express API
   ↓
SQL Queries
   ↓
SQLite
   ↓
tasks.db

Because the tasks are stored in tasks.db, the data survives when the server is restarted.
🏗️ Architecture
The project uses a layered structure:
Client
   ↓
Routes
   ↓
Controllers
   ↓
Models
   ↓
SQLite Database

Routes
Define the API endpoints and HTTP methods.
Controllers
Handle the incoming request and determine the appropriate response.
Models
Handle interaction with the SQLite database.
Database
SQLite permanently stores the task data in tasks.db.
📊 HTTP Status Codes
Status Code	Meaning
200	Successful request
201	Resource created
204	Resource deleted successfully
400	Invalid request
404	Resource not found


🎯 Assignment Requirements
This project satisfies the main requirements of W3 · A1 — Connecting your CRUD to the database:
- [x] API exposes the same CRUD endpoints
- [x] Tasks are stored in SQLite
- [x] Data survives server restarts
- [x] Database is automatically created
- [x] tasks table is automatically created
- [x] Three example tasks are inserted only when the table is empty
- [x] CRUD operations use SQL queries
- [x] Unknown IDs return 404
- [x] Invalid requests return 400
- [x] SQLite database explored using a database viewer
- [x] README updated with database documentation
- [x] Database screenshot included
📌 Project Repository
GitHub:
https://github.com/Paras045/crud-api
👨‍💻 Author
Paras Gunjavate
Computer Engineering Student
GitHub:
https://github.com/Paras045

### One thing before you commit

Your README references:

```text
screenshots/database.png