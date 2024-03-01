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
app.use(cors(corsOptions));

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
app.use("/add_photo", require("./routes/photo/add_photo"));
app.use("/get_photos", require("./routes/photo/get_all"));
app.use("/delete_photo", require("./routes/photo/delete_photo"));
app.use("/get_messages", require("./routes/message/get_messages"));
app.use("/send_message", require("./routes/message/send_message"));
app.use("/read_messages", require("./routes/message/read_messages"));

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
    socket.on("add-user", (userıd) => {
      onlineUsers.set(userıd, socket.id);
    });

    socket.on("send-msg", (data) => {
      const sendUserSocket = onlineUsers.get(data.to);
      if (sendUserSocket) {
        socket.to(sendUserSocket).emit("msg-recieve");
      }
    });
  });
});
