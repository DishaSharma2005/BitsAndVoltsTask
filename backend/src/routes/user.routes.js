const express = require("express");
const router = express.Router();

const upload = require("../middleware/upload");
const userController = require("../controllers/user.controller");

// 🔥 IMPORTANT ORDER
router.get("/export/csv", userController.exportUsersCSV);
router.get("/search", userController.searchUsers);

router.get("/", userController.getUsers);
router.get("/:id", userController.getUserById);

router.post("/", upload.single("profileImage"), userController.createUser);
router.put("/:id", upload.single("profileImage"), userController.updateUser);

router.delete("/:id", userController.deleteUser);

module.exports = router;
