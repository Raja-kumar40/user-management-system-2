const express = require("express");

const authMiddleware = require("../middleware/authMiddleware");

const {
  createMessage,
  getMessages,
  updateMessage,
  deleteMessage,
} = require("../controllers/messageController");

const router = express.Router();

// All message routes require login
router.use(authMiddleware);

router.post("/", createMessage);

router.get("/", getMessages);

router.put("/:id", updateMessage);

router.delete("/:id", deleteMessage);

module.exports = router;
