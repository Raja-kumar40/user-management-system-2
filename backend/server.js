require("dotenv").config();

const express = require("express");
const cors = require("cors");

const sequelize = require("./config/database");

require("./models");

const authRoutes = require("./routes/authRoutes");
const messageRoutes = require("./routes/messageRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "User Notes API is running",
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await sequelize.authenticate();

    console.log("MySQL connected successfully.");

    await sequelize.sync();

    console.log("Database tables synchronized.");

    app.listen(PORT, "0.0.0.0", () => {
      console.log(
        `Server running on http://localhost:${PORT}`
      );
    });
  } catch (error) {
    console.error("Unable to start server:", error);
  }
};

startServer();

