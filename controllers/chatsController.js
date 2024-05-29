const Chat = require("../model/Chat");
const User = require("../model/User");
const mongoose = require("mongoose");

const startChat = async (req, res) => {
  const { user_id, title, sub_title, picture } = req.body;

  try {
    await Chat.create({
      owner_id: user_id,
      title: title,
      sub_title: sub_title,
      picture: picture,
      participants: [{ _id: user_id }],
    });

    res.status(200).json({
      status: 200,
      message: "Sohbet odalası başarıyla oluşturuldu!",
    });
  } catch (err) {
    res.status(500).json({ status: 500, message: err.message });
  }
};

const getAllChats = async (req, res) => {
  const { user_id } = req.body;

  try {
    if (user_id) {
      const user = await User.findOne({
        _id: user_id,
      }).exec();
      const chats = await Chat.aggregate([
        {
          $match: { _id: { $nin: user.blocked_chats } },
        },
        {
          $lookup: {
            from: "users",
            localField: "participants._id",
            foreignField: "_id",
            as: "users_info",
          },
        },
      ]);

      res.status(200).json({
        status: 200,
        data: chats,
        message: "Sohbet odaları başarıyla döndürüldü!",
      });
    } else {
      const chats = await Chat.aggregate([
        {
          $lookup: {
            from: "users",
            localField: "participants._id",
            foreignField: "_id",
            as: "users_info",
          },
        },
      ]);

      res.status(200).json({
        status: 200,
        data: chats,
        message: "Sohbet odaları başarıyla döndürüldü!",
      });
    }
  } catch (err) {
    res.status(500).json({ status: 500, message: err.message });
  }
};

const sendChatMessage = async (req, res) => {
  const { chat_id, message_sended } = req.body;

  try {
    const chat = await Chat.findOne({ _id: chat_id }).exec();

    message_sended.date = new Date();
    chat.messages = chat.messages.concat([message_sended]);

    const sender_id = message_sended.sender.toString();
    let participants_array = chat.participants.map((i) => i._id.toString());
    if (!participants_array.includes(sender_id)) {
      chat.participants = chat.participants.concat([{ _id: sender_id }]);
    }

    await chat.markModified("participants");
    await chat.markModified("messages");
    await chat.save();

    res.status(200).json({
      status: 200,
      data: chat,
      message: "Mesaj başarıyla gönderildi.",
    });
  } catch (err) {
    res.status(500).json({ status: 500, message: err.message });
  }
};

const deleteChat = async (req, res) => {
  const { chat_id } = req.body;

  try {
    await Chat.deleteOne({ _id: chat_id }).exec();

    res.status(200).json({
      status: 200,
      message: "Sohbet odası başarıyla silindi!",
    });
  } catch (err) {
    res.status(500).json({ status: 500, message: err.message });
  }
};

module.exports = {
  startChat,
  getAllChats,
  sendChatMessage,
  deleteChat,
};
