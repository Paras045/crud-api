const express = require("express");
const authMiddleware = require("../middleware/authMiddleware")
const taskController = require("../controllers/taskController");


const router = express.Router();
router.use(authMiddleware);

router.get("/", taskController.getAllTasks);

router.get("/:id", taskController.getTaskById);

router.post("/", taskController.createTask);

router.put("/:id", taskController.updateTask);

router.delete("/:id", taskController.deleteTask);

module.exports = router;