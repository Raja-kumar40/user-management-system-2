const { Message } = require("../models");

// =========================
// CREATE MESSAGE
// =========================

const createMessage = async (req, res) => {
  try {
    const { message } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({
        message: "Message is required",
      });
    }

    if (message.length > 500) {
      return res.status(400).json({
        message: "Message cannot exceed 500 characters",
      });
    }

    const newMessage = await Message.create({
      message: message.trim(),
      userId: req.user.id,
    });

    return res.status(201).json({
      message: "Message created successfully",
      data: newMessage,
    });
  } catch (error) {
    console.error("Create Message Error:", error);

    return res.status(500).json({
      message: "Failed to create message",
    });
  }
};

// =========================
// GET OWN MESSAGES
// =========================

const getMessages = async (req, res) => {
  try {
    const messages = await Message.findAll({
      where: {
        userId: req.user.id,
      },

      order: [
        ["createdAt", "DESC"],
      ],
    });

    return res.status(200).json({
      data: messages,
    });
  } catch (error) {
    console.error("Get Messages Error:", error);

    return res.status(500).json({
      message: "Failed to fetch messages",
    });
  }
};

// =========================
// UPDATE MESSAGE
// =========================

const updateMessage = async (req, res) => {
  try {
    const { id } = req.params;
    const { message } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({
        message: "Message is required",
      });
    }

    if (message.length > 500) {
      return res.status(400).json({
        message: "Message cannot exceed 500 characters",
      });
    }

    const existingMessage = await Message.findOne({
      where: {
        id,
        userId: req.user.id,
      },
    });

    if (!existingMessage) {
      return res.status(404).json({
        message: "Message not found",
      });
    }

    existingMessage.message = message.trim();

    await existingMessage.save();

    return res.status(200).json({
      message: "Message updated successfully",
      data: existingMessage,
    });
  } catch (error) {
    console.error("Update Message Error:", error);

    return res.status(500).json({
      message: "Failed to update message",
    });
  }
};

// =========================
// DELETE MESSAGE
// =========================

const deleteMessage = async (req, res) => {
  try {
    const { id } = req.params;

    const existingMessage = await Message.findOne({
      where: {
        id,
        userId: req.user.id,
      },
    });

    if (!existingMessage) {
      return res.status(404).json({
        message: "Message not found",
      });
    }

    await existingMessage.destroy();

    return res.status(200).json({
      message: "Message deleted successfully",
    });
  } catch (error) {
    console.error("Delete Message Error:", error);

    return res.status(500).json({
      message: "Failed to delete message",
    });
  }
};

module.exports = {
  createMessage,
  getMessages,
  updateMessage,
  deleteMessage,
};
