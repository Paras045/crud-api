const express = require("express");

const app = express();
app.use(express.json());
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

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});