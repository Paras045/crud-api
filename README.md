# CRUD REST API

A CRUD REST API built with **Node.js, Express.js, and PostgreSQL**, containerized using **Docker and Docker Compose**.

The project started as an in-memory CRUD API, was upgraded to SQLite, and now uses PostgreSQL for persistent storage. The API endpoints remain consistent across the database migration.

## 🚀 Features

- RESTful CRUD API
- PostgreSQL database with `pg`
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
- **PostgreSQL**
- **`pg` PostgreSQL client**
- **Docker**
- **Docker Compose**
- **Swagger UI**

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
├── Dockerfile
├── .dockerignore
├── compose.yaml
├── .env.example
├── server.js
├── .env
├── .gitignore
├── package.json
├── package-lock.json
└── README.md
```

## 🗄️ Database

The application uses PostgreSQL for persistent task storage. The database and `tasks` table are initialized automatically when the application starts. SQLite was used in an earlier version of the project.

Three sample tasks are automatically inserted only when the table is empty.

## 🔌 API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/tasks` | Get all tasks |
| GET | `/tasks/:id` | Get a task by ID |
| POST | `/tasks` | Create a new task |
| PUT | `/tasks/:id` | Update a task |
| DELETE | `/tasks/:id` | Delete a task |
## 📖 Swagger Documentation
The API includes interactive Swagger/OpenAPI documentation.
After starting the server, open:
http://localhost:3000/docs

Swagger allows you to test all CRUD endpoints directly from the browser.
## ⚙️ Environment Configuration
The application uses environment variables through dotenv.
Create a .env file in the project root:
PORT=3000

The server uses the configured port and falls back to port 3000 if no port is provided.
const port = process.env.PORT || 3000;

The .env file is excluded from Git using .gitignore.
## 🚀 Getting Started
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
## 🧪 Testing the API
Get all tasks
GET /tasks

Example:
[
  {
    "id": 10,
    "title": "TASK 1",
    "done": false
  },
  {
    "id": 11,
    "title": "TASK 2",
    "done": false
  },
  {
    "id": 12,
    "title": "TASK 3",
    "done": false
  }
]

Get a task by ID
GET /tasks/10

Example response:
{
  "id": 10,
  "title": "TASK 1",
  "done": false
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
  "title": "Learn PostgreSQL"
}

Successful response:
201 Created

Example:
{
  "id": 13,
  "title": "Learn PostgreSQL",
  "done": false
}

Update a task
PUT /tasks/13

Request body:
{
  "title": "Learn PostgreSQL",
  "done": true
}

Successful response:
200 OK

Example:
{
  "id": 13,
  "title": "Learn PostgreSQL",
  "done": true
}

The API accepts `true` or `false` for the `done` field, which PostgreSQL stores as a Boolean value.
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

## PostgreSQL Database

The application uses PostgreSQL to store task records persistently.

The `tasks` table contains:

| Column | Type | Description |
|---|---|---|
| `id` | SERIAL PRIMARY KEY | Unique task identifier |
| `title` | TEXT NOT NULL | Task title |
| `done` | BOOLEAN | Task completion status |

The database and table are initialized automatically when the API starts. Three example tasks are inserted only when the table is empty.

## Database Queries

The PostgreSQL database can be accessed through the Docker Compose database service.

Open the PostgreSQL shell:

```bash
docker compose exec db psql -U postgres -d tasks
```

List all tasks:

```sql
SELECT * FROM tasks ORDER BY id;
```

Show completed tasks:

```sql
SELECT * FROM tasks WHERE done = TRUE;
```

Count all tasks:

```sql
SELECT COUNT(*) FROM tasks;
```

Mark every task as completed:

```sql
UPDATE tasks SET done = TRUE;
```

Delete all completed tasks:

```sql
DELETE FROM tasks WHERE done = TRUE;
```

Exit the PostgreSQL shell:

```text
\q
```

## Data Persistence

The application originally stored tasks in an in-memory JavaScript array. The earlier database version used SQLite. The current version uses PostgreSQL running in Docker.

The current architecture is:

Client  
↓  
Express API  
↓  
Task Controllers  
↓  
Task Models  
↓  
PostgreSQL Database

Docker Compose runs the API and PostgreSQL as separate services. A named Docker volume, `taskdata`, stores the PostgreSQL data separately from the database container.

The data remains available after the Compose containers are stopped and started again, provided the named volume is preserved.

To stop the services without deleting the database volume:

```bash
docker compose down
```

Start them again:

```bash
docker compose up -d
```

Verify the task records:

```bash
Invoke-RestMethod -Uri http://localhost:3000/tasks
```

## Docker Setup

### Prerequisites

- Docker Desktop
- Docker Compose

### Run the application

Build the API image and start both services:

```bash
docker compose up --build -d
```

Check the service status:

```bash
docker compose ps
```

View API logs:

```bash
docker compose logs api
```

View database logs:

```bash
docker compose logs db
```

The API is available at:

`http://localhost:3000`

The tasks endpoint is:

`http://localhost:3000/tasks`

Stop the application:

```bash
docker compose down
```

The database volume is retained when using this command without the `-v` option.

## Project Architecture

The project follows a layered architecture:

- **Routes:** Define the API endpoints and HTTP methods.
- **Controllers:** Validate incoming requests and prepare responses.
- **Models:** Execute PostgreSQL queries for task operations.
- **Database module:** Creates the PostgreSQL connection pool and initializes the table.
- **Docker Compose:** Runs the API and database services together.
- **Persistent volume:** Stores database data across container restarts.

## HTTP Status Codes

| Status Code | Meaning |
|---|---|
| 200 | Successful request |
| 201 | Resource created |
| 204 | Resource deleted successfully |
| 400 | Invalid request |
| 404 | Resource not found |

## Assignment Requirements — W3 · A3

- [x] API exposes the existing CRUD endpoints.
- [x] PostgreSQL is used as the database.
- [x] Database and table initialization are handled by the application.
- [x] Three example tasks are inserted only when the table is empty.
- [x] CRUD operations use PostgreSQL queries.
- [x] Unknown task IDs return 404 responses.
- [x] API and PostgreSQL run as separate Docker Compose services.
- [x] API connects to PostgreSQL through the Compose service hostname.
- [x] PostgreSQL uses a named persistent Docker volume.
- [x] API and database can be started with one Compose command.
- [x] Task records remain available after stopping and restarting the Compose stack.

## Environment Configuration

Create a local `.env` file based on `.env.example` when running the API directly on your computer.

The `.env` file should not be committed to Git. Docker Compose supplies the database connection string for the containerized API.

## Technology Stack

- Node.js
- Express.js
- PostgreSQL
- `pg` PostgreSQL client
- Docker
- Docker Compose
- Swagger UI
