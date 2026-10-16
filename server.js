require("dotenv").config();
const protectedRoutes = require("./routes/protectedRoutes");
const publicRoutes = require("./routes/publicRoutes");
const authRoutes = require("./routes/authRoutes");
const { connectRedis } = require("./redisClient");
const express = require("express");
const swaggerUi = require("swagger-ui-express");
const taskRoutes = require("./routes/taskRoutes");
const { initializeDatabase } = require("./database");

const app = express();
const port =  process.env.PORT || 3000;;


app.use(express.json());
app.use("/protected", protectedRoutes);
app.use("/public", publicRoutes);
app.use("/auth", authRoutes);

// =========================
// Swagger / OpenAPI
// =========================

const swaggerDocument = {
    openapi: "3.0.0",

    info: {
        title: "Task & Authentication API",
        version: "1.0.0",
        description: "Task CRUD API with Supabase authentication, public endpoints, and protected routes"
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
                security: [{ bearerAuth: [] }],
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
            post: {
                summary: "Create a task",
                security: [{ bearerAuth: [] }],
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
                security: [{ bearerAuth: [] }],
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
                security: [{ bearerAuth: [] }],

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
                security: [{ bearerAuth: [] }],

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
        },
        "/auth/signup": {
            post: {
                summary: "Register a new user",
                tags: ["Authentication"],
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                required: ["email", "password"],
                                properties: {
                                    email: { type: "string", format: "email" },
                                    password: { type: "string", format: "password" }
                                }
                            }
                        }
                    }
                },
                responses: {
                    "201": { description: "User registered" },
                    "400": { description: "Signup failed or fields missing" }
                }
            }
        },
        "/auth/login": {
            post: {
                summary: "Log in and receive tokens",
                tags: ["Authentication"],
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                required: ["email", "password"],
                                properties: {
                                    email: { type: "string", format: "email" },
                                    password: { type: "string", format: "password" }
                                }
                            }
                        }
                    }
                },
                responses: {
                    "200": { description: "Login successful; returns access and refresh tokens" },
                    "400": { description: "Email or password missing" },
                    "401": { description: "Invalid login credentials" }
                }
            }
        },
        "/auth/logout": {
            post: {
                summary: "Log out the current user",
                tags: ["Authentication"],
                security: [{ bearerAuth: [] }],
                responses: {
                    "204": { description: "Logout successful" },
                    "401": { description: "Access token required or logout failed" }
                }
            }
        },
        "/public/info": {
            get: {
                summary: "Get public information",
                tags: ["Public"],
                responses: {
                    "200": { description: "Public information returned" }
                }
            }
        },
        "/protected/profile": {
            get: {
                summary: "Get the authenticated user's profile",
                tags: ["Protected"],
                security: [{ bearerAuth: [] }],
                responses: {
                    "200": { description: "User profile returned" },
                    "401": { description: "Missing or invalid access token" }
                }
            }
        },
        "/protected/dashboard": {
            get: {
                summary: "Get the protected dashboard",
                tags: ["Protected"],
                security: [{ bearerAuth: [] }],
                responses: {
                    "200": { description: "Dashboard returned" },
                    "401": { description: "Missing or invalid access token" }
                }
            }
        }
    },

    // =========================
    // Reusable Schemas
    // =========================

    components: {
        
      securitySchemes: {
        bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT"
    }
    },

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

async function startServer() {
    await initializeDatabase();
    await connectRedis();

    app.listen(port, () => {
        console.log(`Server is running on http://localhost:${port}`);
    });
}

startServer();
