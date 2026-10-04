const express = require("express");
const swaggerUi = require("swagger-ui-express");
const taskRoutes = require("./routes/taskRoutes");

const app = express();
const port = 3000;

app.use(express.json());

// =========================
// Swagger / OpenAPI
// =========================

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
        // =========================
        // GET /tasks
        // =========================
        "/tasks": {
            get: {
                summary: "Get all tasks",

                responses: {
                    "200": {
                        description: "List of tasks",

                        content: {
                            "application/json": {
                                schema: {
                                    type: "array",
                                    items: {
                                        $ref: "#/components/schemas/Task"
                                    }
                                }
                            }
                        }
                    }
                }
            },

            // =========================
            // POST /tasks
            // =========================
            post: {
                summary: "Create a task",

                requestBody: {
                    required: true,

                    content: {
                        "application/json": {
                            schema: {
                                $ref: "#/components/schemas/CreateTask"
                            }
                        }
                    }
                },

                responses: {
                    "201": {
                        description: "Task created",

                        content: {
                            "application/json": {
                                schema: {
                                    $ref: "#/components/schemas/Task"
                                }
                            }
                        }
                    },

                    "400": {
                        description: "Invalid input",

                        content: {
                            "application/json": {
                                schema: {
                                    $ref: "#/components/schemas/Error"
                                }
                            }
                        }
                    }
                }
            }
        },

        // =========================
        // /tasks/{id}
        // =========================
        "/tasks/{id}": {
            // =========================
            // GET /tasks/{id}
            // =========================
            get: {
                summary: "Get a task by ID",

                parameters: [
                    {
                        name: "id",
                        in: "path",
                        required: true,

                        schema: {
                            type: "integer"
                        },

                        example: 1
                    }
                ],

                responses: {
                    "200": {
                        description: "Task found",

                        content: {
                            "application/json": {
                                schema: {
                                    $ref: "#/components/schemas/Task"
                                }
                            }
                        }
                    },

                    "404": {
                        description: "Task not found",

                        content: {
                            "application/json": {
                                schema: {
                                    $ref: "#/components/schemas/Error"
                                }
                            }
                        }
                    }
                }
            },

            // =========================
            // PUT /tasks/{id}
            // =========================
            put: {
                summary: "Update a task",

                parameters: [
                    {
                        name: "id",
                        in: "path",
                        required: true,

                        schema: {
                            type: "integer"
                        },

                        example: 1
                    }
                ],

                requestBody: {
                    required: true,

                    content: {
                        "application/json": {
                            schema: {
                                $ref: "#/components/schemas/UpdateTask"
                            }
                        }
                    }
                },

                responses: {
                    "200": {
                        description: "Task updated",

                        content: {
                            "application/json": {
                                schema: {
                                    $ref: "#/components/schemas/Task"
                                }
                            }
                        }
                    },

                    "400": {
                        description: "Invalid input",

                        content: {
                            "application/json": {
                                schema: {
                                    $ref: "#/components/schemas/Error"
                                }
                            }
                        }
                    },

                    "404": {
                        description: "Task not found",

                        content: {
                            "application/json": {
                                schema: {
                                    $ref: "#/components/schemas/Error"
                                }
                            }
                        }
                    }
                }
            },

            // =========================
            // DELETE /tasks/{id}
            // =========================
            delete: {
                summary: "Delete a task",

                parameters: [
                    {
                        name: "id",
                        in: "path",
                        required: true,

                        schema: {
                            type: "integer"
                        },

                        example: 1
                    }
                ],

                responses: {
                    "204": {
                        description: "Task deleted"
                    },

                    "404": {
                        description: "Task not found",

                        content: {
                            "application/json": {
                                schema: {
                                    $ref: "#/components/schemas/Error"
                                }
                            }
                        }
                    }
                }
            }
        }
    },

    // =========================
    // Reusable Schemas
    // =========================

    components: {
        schemas: {
            // =========================
            // Task response
            // =========================
            Task: {
                type: "object",

                properties: {
                    id: {
                        type: "integer",
                        example: 1
                    },

                    title: {
                        type: "string",
                        example: "Learn SQLite"
                    },

                    done: {
                        type: "integer",
                        enum: [0, 1],
                        example: 0
                    }
                }
            },

            // =========================
            // POST request
            // =========================
            CreateTask: {
                type: "object",

                required: ["title"],

                properties: {
                    title: {
                        type: "string",
                        example: "Learn Express"
                    }
                }
            },

            // =========================
            // PUT request
            // =========================
            UpdateTask: {
                type: "object",

                properties: {
                    title: {
                        type: "string",
                        example: "Learn SQLite"
                    },

                    done: {
                        type: "boolean",
                        example: true
                    }
                }
            },

            // =========================
            // Error response
            // =========================
            Error: {
                type: "object",

                properties: {
                    error: {
                        type: "string",
                        example: "Task 99 not found"
                    }
                }
            }
        }
    }
};

// Swagger UI
app.use(
    "/docs",
    swaggerUi.serve,
    swaggerUi.setup(swaggerDocument)
);

// =========================
// API Routes
// =========================

app.use("/tasks", taskRoutes);

// =========================
// Start Server
// =========================

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});