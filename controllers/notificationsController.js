const mongoose = require("mongoose");
const User = require("../model/User");
//FCM
var FCM = require("fcm-node");
var serverKey = process.env.FIREBASE_SERVER_KEY;
var fcm = new FCM(serverKey);
//Notification
const Notification = require("../model/Notification");

const getNotifications = async (req, res) => {
  const { user_id } = req.body;

  try {
    const notifications = await Notification.aggregate([
      {
        $match: {
          owner_id: mongoose.Types.ObjectId(user_id),
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "related_id",
          foreignField: "_id",
          as: "related_info",
        },
      },
    ]);

    res.status(200).json({
      status: 200,
      message: "Bildirimler başarıyla bulundu!",
      data: notifications,
    });
  } catch (err) {
    res.status(500).json({ status: 500, message: err.message });
  }
};

const readNotifications = async (req, res) => {
  const { user_id } = req.body;

  try {
    const notifications = await Notification.updateMany(
      {
        owner_id: mongoose.Types.ObjectId(user_id),
      },
      {
        readed: true,
      }
    );

    res.status(200).json({
      status: 200,
      message: "Bildirimler başarıyla okundu!",
      data: notifications,
    });
  } catch (err) {
    res.status(500).json({ status: 500, message: err.message });
  }
};

const getAllNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ type: "99" }).exec();

    res.status(200).json({
      status: 200,
      data: notifications,
      message: `Bütün bildirimler başarı ile döndürüldü!`,
    });
  } catch (err) {
    res.status(500).json({ status: 500, message: err.message });
  }
};

const sendNotifications = async (req, res) => {
  const { title, message } = req.body;

  try {
    const users = await User.find();

    let tokens = users
      .filter((user) => user.notification_token !== "")
      .map((user) => user.notification_token);
    //console.log(tokens); //TODO: language seperation

    let notification = await Notification.create({
      type: "99",
      title: title,
      message: message,
    });

    var notif_message = {
      registration_ids: tokens,
      notification: {
        title: title.tr, //TODO: Maybe language from user
        body: message.tr, //TODO: Maybe language from user
      },
    };

    fcm.send(notif_message, () => {});

    res.status(200).json({
      status: 200,
      message: `Bildirimler başarı ile gönderildi!`,
    });
  } catch (err) {
    res.status(500).json({ status: 500, message: err.message });
  }
};

module.exports = {
  getNotifications,
  readNotifications,
  getAllNotifications,
  sendNotifications,
};
