const express = require("express");
const swaggerUi = require("swagger-ui-express");

const app = express();
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
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
const port = 3000;

const tasks = [
    {
        id: 1,
        title: "Learn JavaScript",
        done: false
    },
    {
        id: 2,
        title: "Build CRUD API",
        done: false
    },
    {
        id: 3,
        title: "Push project to GitHub",
        done: false
    }
];



app.get("/tasks", (req, res) => {
    res.json(tasks);
})

app.get("/tasks/:id", (req, res) => {
    const task = tasks.find(
        (task) => task.id === Number(req.params.id)
    );

    if (!task) {
        return res.status(404).json({
            error: `Task ${req.params.id} not found`
        });
    }

    res.json(task);
});

app.post("/tasks", (req, res) => {
    const { title } = req.body;

    if (!title || title.trim() === "") {
        return res.status(400).json({
            error: "Title is required"
        });
    }

    const newTask = {
        id: tasks.length + 1,
        title: title.trim(),
        done: false
    };

    tasks.push(newTask);

    res.status(201).json(newTask);
});

app.put("/tasks/:id", (req, res) => {
    const task = tasks.find(
        (task) => task.id === Number(req.params.id)
    );

    if (!task) {
        return res.status(404).json({
            error: `Task ${req.params.id} not found`
        });
    }

    const { title, done } = req.body;

    if (
        req.body.title === undefined &&
        req.body.done === undefined
    ) {
        return res.status(400).json({
            error: "Title or done is required"
        });
    }

    if (title !== undefined) {
        if (typeof title !== "string" || title.trim() === "") {
            return res.status(400).json({
                error: "Title must be a non-empty string"
            });
        }

        task.title = title.trim();
    }

    if (done !== undefined) {
        if (typeof done !== "boolean") {
            return res.status(400).json({
                error: "Done must be true or false"
            });
        }

        task.done = done;
    }

    res.json(task);
});

app.delete("/tasks/:id", (req, res) => {
    const index = tasks.findIndex(
        (task) => task.id === Number(req.params.id)
    );

    if (index === -1) {
        return res.status(404).json({
            error: `Task ${req.params.id} not found`
        });
    }

    tasks.splice(index, 1);

    res.status(204).send();
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});