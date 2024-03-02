const User = require("../model/User");
const Message = require("../model/Message");
const mongoose = require("mongoose");
//Notification
const Notification = require("../model/Notification");
var FCM = require("fcm-node");
var serverKey = process.env.FIREBASE_SERVER_KEY;
var fcm = new FCM(serverKey);

const getAllMessages = async (req, res) => {
  const { user_id } = req.body;

  try {
    const messages = await Message.aggregate([
      {
        $match: {
          $or: [
            {
              sender_id: mongoose.Types.ObjectId(user_id),
            },
            {
              reciever_id: mongoose.Types.ObjectId(user_id),
            },
          ],
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "sender_id",
          foreignField: "_id",
          as: "sender_info",
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "reciever_id",
          foreignField: "_id",
          as: "reciever_info",
        },
      },
    ]);

    res.status(200).json({
      status: 200,
      data: messages,
      message: "Mesajlar başarıyla döndürüldü!",
    });
  } catch (err) {
    res.status(500).json({ status: 500, message: err.message });
  }
};

const sendMessage = async (req, res) => {
  const { message_id, message_sended } = req.body;

  try {
    const message = await Message.findOne({ _id: message_id }).exec();

    const sender_id =
      message.sender_id.toString() === message_sended.sender
        ? message.reciever_id
        : message.sender_id;
    const sender_user = await User.findOne({
      _id: message_sended.sender,
    }).exec();
    const reciever_user = await User.findOne({ _id: sender_id }).exec();

    if (message.messages.length === 0) {
      var message1 = {
        to: reciever_user.notification_token,
        notification: {
          title: "Kısmet Çarkı",
          body: sender_user.name + " sana mesaj gönderdi⚡️",
        },
      };

      await Notification.create({
        owner_id: reciever_user._id,
        type: 1,
        related_id: sender_user._id,
        readed: false,
      });

      fcm.send(message1, function (err, response) {
        if (err) {
        } else {
        }
      });
    } else {
      var message1 = {
        to: reciever_user.notification_token,
        notification: {
          title: "Kısmet Çarkı",
          body: sender_user.name + " sana mesaj gönderdi⚡️",
        },
      };

      fcm.send(message1, function (err, response) {
        if (err) {
        } else {
        }
      });
    }

    message_sended.date = new Date();
    message.messages = message.messages.concat([message_sended]);

    await message.markModified("messages");
    await message.save();

    res.status(200).json({
      status: 200,
      data: message,
      message: "Mesaj başarıyla gönderildi.",
    });
  } catch (err) {
    res.status(500).json({ status: 500, message: err.message });
  }
};

const readAllMessages = async (req, res) => {
  const { message_id, user_id } = req.body;

  try {
    const message = await Message.findOne({ _id: message_id }).exec();

    message.messages = message.messages.map((i) => {
      if (!i.readed_by.includes(user_id)) {
        i.readed_by = i.readed_by.concat([user_id]);
      }

      return i;
    });

    await message.markModified("messages");
    await message.save();

    res.status(200).json({
      status: 200,
      data: message,
      message: "Mesajlar başarıyla döndürüldü!",
    });
  } catch (err) {
    res.status(500).json({ status: 500, message: err.message });
  }
};

module.exports = {
  getAllMessages,
  sendMessage,
  readAllMessages,
};
