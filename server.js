require("dotenv").config();
const express = require("express");
const app = express();
const socket = require("socket.io");
const path = require("path");
const cors = require("cors");
const corsOptions = require("./config/corsOptions");
const errorHandler = require("./middleware/errorHandler");
const verifyJWT = require("./middleware/verifyJWT");
const cookieParser = require("cookie-parser");
const credentials = require("./middleware/credentials");
const mongoose = require("mongoose");
const connectDB = require("./config/dbConn");
const PORT = process.env.PORT || 3500;

// Connect to MongoDB
connectDB();

// Handle options credentials check - before CORS!
// and fetch cookies credentials requirement
app.use(credentials);

// Cross Origin Resource Sharing
app.use(cors({ credentials: true, origin: true }));

// built-in middleware to handle urlencoded form data
app.use(express.urlencoded({ extended: false }));

// built-in middleware for json
app.use(express.json());

//middleware for cookies
app.use(cookieParser());

//serve static files
app.use("/", express.static(path.join(__dirname, "/public")));

// routes
app.use("/", require("./routes/root"));
app.use("/register", require("./routes/auth/register"));
app.use("/confirm_register_otp", require("./routes/auth/confirm_register_otp"));
app.use("/resend_register_otp", require("./routes/auth/resend_register_otp"));
app.use("/login", require("./routes/auth/auth"));
app.use("/confirm_login_otp", require("./routes/auth/confirm_login_otp"));
app.use("/resend_login_otp", require("./routes/auth/resend_login_otp"));

//Inside mobile
app.use("/update_profile", require("./routes/update_profile"));
app.use("/find_fortune", require("./routes/find_fortune"));
app.use("/get_user", require("./routes/get_user"));
app.use("/get_users", require("./routes/get_users"));
app.use("/add_photo", require("./routes/photo/add_photo"));
app.use("/get_photos", require("./routes/photo/get_all"));
app.use("/delete_photo", require("./routes/photo/delete_photo"));
app.use("/get_messages", require("./routes/message/get_messages"));
app.use("/send_message", require("./routes/message/send_message"));
app.use("/read_messages", require("./routes/message/read_messages"));
app.use("/start_chat", require("./routes/chat/start_chat"));
app.use("/get_chats", require("./routes/chat/get_chats"));
app.use("/send_chat", require("./routes/chat/send_chat"));
app.use("/get_notifications", require("./routes/get_notifications"));
app.use("/read_notifications", require("./routes/read_notifications"));
app.use("/get_posts", require("./routes/post/get_posts"));
app.use("/add_post", require("./routes/post/add_post"));
app.use("/report_user", require("./routes/report/user"));
app.use("/add_support", require("./routes/add_support"));

//For creating users
app.use("/register_users", require("./routes/auth/register_users"));

//For Admin
//Users
app.use("/get_all_users", require("./routes/admin/get_all_users"));
app.use("/suspend_user", require("./routes/admin/suspend_user"));
//Notifications
app.use(
  "/get_all_notifications",
  require("./routes/admin/notifications/get_all_notifications")
);
app.use(
  "/send_notifications",
  require("./routes/admin/notifications/send_notifications")
);
//Supports
app.use("/get_all_supports", require("./routes/admin/get_all_supports"));
//Reports
app.use("/get_all_reports", require("./routes/admin/get_all_reports"));
//Chats
app.use("/delete_chat", require("./routes/admin/delete_chat"));

/*
app.use("/refresh", require("./routes/refresh"));
app.use("/logout", require("./routes/logout"));

app.use(verifyJWT);
app.use("/users", require("./routes/api/users"));
*/

app.all("*", (req, res) => {
  res.status(404);
  if (req.accepts("html")) {
    res.sendFile(path.join(__dirname, "views", "404.html"));
  } else if (req.accepts("json")) {
    res.json({ error: "404 Not Found" });
  } else {
    res.type("txt").send("404 Not Found");
  }
});

app.use(errorHandler);

mongoose.connection.once("open", () => {
  const server = app.listen(PORT, () =>
    console.log(`Server running on port ${PORT}`)
  );

  const io = socket(server);

  global.onlineUsers = new Map();

  io.on("connection", (socket) => {
    global.chatSocket = socket;
    socket.on("add-user", (userId) => {
      onlineUsers.set(userId, socket.id);
    });

    socket.on("send-msg", (data) => {
      const sendUserSocket = onlineUsers.get(data.to);
      if (sendUserSocket) {
        socket.to(sendUserSocket).emit("msg-recieve");
      }
    });
  });
});
