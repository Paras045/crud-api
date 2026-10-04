const express = require("express");
const swaggerUi = require("swagger-ui-express");
const db = require("./database");

const app = express();
const port = 3000;

app.use(express.json());

const swaggerDocument = {
    openapi: "3.0.0",
    info: {
        title: "Task API",
        version: "1.0.0",
        description: "A simple CRUD API for managing tasks"
    },
    servers: [
        {
            url: "http://localhost:3000"
        }
    ],
    paths: {
        "/tasks": {
            get: {
                summary: "Get all tasks",
                responses: {
                    "200": {
                        description: "List of tasks"
                    }
                }
            },
            post: {
                summary: "Create a task",
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                required: ["title"],
                                properties: {
                                    title: {
                                        type: "string"
                                    }
                                }
                            }
                        }
                    }
                },
                responses: {
                    "201": {
                        description: "Task created"
                    },
                    "400": {
                        description: "Invalid input"
                    }
                }
            }
        },

        "/tasks/{id}": {
            get: {
                summary: "Get a task by ID",
                parameters: [
                    {
                        name: "id",
                        in: "path",
                        required: true,
                        schema: {
                            type: "integer"
                        }
                    }
                ],
                responses: {
                    "200": {
                        description: "Task found"
                    },
                    "404": {
                        description: "Task not found"
                    }
                }
            },

            put: {
                summary: "Update a task",
                parameters: [
                    {
                        name: "id",
                        in: "path",
                        required: true,
                        schema: {
                            type: "integer"
                        }
                    }
                ],
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    title: {
                                        type: "string"
                                    },
                                    done: {
                                        type: "boolean"
                                    }
                                }
                            }
                        }
                    }
                },
                responses: {
                    "200": {
                        description: "Task updated"
                    },
                    "400": {
                        description: "Invalid input"
                    },
                    "404": {
                        description: "Task not found"
                    }
                }
            },

            delete: {
                summary: "Delete a task",
                parameters: [
                    {
                        name: "id",
                        in: "path",
                        required: true,
                        schema: {
                            type: "integer"
                        }
                    }
                ],
                responses: {
                    "204": {
                        description: "Task deleted"
                    },
                    "404": {
                        description: "Task not found"
                    }
                }
            }
        }
    }
};

app.use(
    "/docs",
    swaggerUi.serve,
    swaggerUi.setup(swaggerDocument)
);


// ==================== GET ALL TASKS ====================

const getAllTasks = db.prepare("SELECT * FROM tasks");

app.get("/tasks", (req, res) => {
    const tasks = getAllTasks.all();

    res.json(tasks);
});


// ==================== GET TASK BY ID ====================

const getTaskById = db.prepare(
    "SELECT * FROM tasks WHERE id = ?"
);

app.get("/tasks/:id", (req, res) => {
    const id = req.params.id;

    const task = getTaskById.get(id);

    if (!task) {
        return res.status(404).json({
            error: `Task ${id} not found`
        });
    }

    res.json(task);
});


// ==================== CREATE TASK ====================

const insertTask = db.prepare(
    "INSERT INTO tasks (title, done) VALUES (?, ?)"
);

const getCreatedTask = db.prepare(
    "SELECT * FROM tasks WHERE id = ?"
);

app.post("/tasks", (req, res) => {
    const { title } = req.body;

    if (typeof title !== "string" || title.trim() === "") {
    return res.status(400).json({
        error: "Title must be a non-empty string"
    });
}

    const result = insertTask.run(title.trim(), 0);

    const id = result.lastInsertRowid;

    const task = getCreatedTask.get(id);

    res.status(201).json(task);
});


// ==================== UPDATE TASK ====================

app.put("/tasks/:id", (req, res) => {
    const { title, done } = req.body;
    const id = req.params.id;

    // At least one field is required
    if (title === undefined && done === undefined) {
        return res.status(400).json({
            error: "Title or done is required"
        });
    }

    // Validate title
    if (
        title !== undefined &&
        (typeof title !== "string" || title.trim() === "")
    ) {
        return res.status(400).json({
            error: "Title must be a non-empty string"
        });
    }

    // Validate done
    if (
        done !== undefined &&
        typeof done !== "boolean"
    ) {
        return res.status(400).json({
            error: "Done must be true or false"
        });
    }

    let result;

    // Both title and done
    if (title !== undefined && done !== undefined) {
        const update = db.prepare(
            "UPDATE tasks SET title = ?, done = ? WHERE id = ?"
        );

        result = update.run(
            title.trim(),
            done ? 1 : 0,
            id
        );
    }

    // Title only
    else if (title !== undefined) {
        const update = db.prepare(
            "UPDATE tasks SET title = ? WHERE id = ?"
        );

        result = update.run(
            title.trim(),
            id
        );
    }

    // Done only
    else {
        const update = db.prepare(
            "UPDATE tasks SET done = ? WHERE id = ?"
        );

        result = update.run(
            done ? 1 : 0,
            id
        );
    }

    if (result.changes === 0) {
        return res.status(404).json({
            error: `Task ${id} not found`
        });
    }

    const task = getTaskById.get(id);

    res.status(200).json(task);
});


// ==================== DELETE TASK ====================

const deleteTask = db.prepare(
    "DELETE FROM tasks WHERE id = ?"
);

app.delete("/tasks/:id", (req, res) => {
    const id = req.params.id;

    const result = deleteTask.run(id);

    if (result.changes === 0) {
        return res.status(404).json({
            error: `Task ${id} not found`
        });
    }

    res.status(204).send();
});


// ==================== START SERVER ====================

app.listen(port, () => {
    console.log(
        `Server is running on http://localhost:${port}`
    );
});