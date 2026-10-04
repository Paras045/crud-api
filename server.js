const express = require("express");
const swaggerUi = require("swagger-ui-express");
const taskRoutes = require("./routes/taskRoutes");

const app = express();

app.use(express.json());

// Swagger configuration
const swaggerDocument = {
    // keep your existing swaggerDocument here
};

app.use(
    "/docs",
    swaggerUi.serve,
    swaggerUi.setup(swaggerDocument)
);

// Task routes
app.use("/tasks", taskRoutes);

const port = 3000;

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});