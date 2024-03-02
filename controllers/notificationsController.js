const User = require("../model/User");
const mongoose = require("mongoose");
//Notification
const Notification = require("../model/Notification");

const getNotifications = async (req, res) => {
  const { user_id } = req.body;

  try {
    const notifications = await Notification.aggregate([
      {
        $match: {
          owner: mongoose.Types.ObjectId(user_id),
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

module.exports = {
  getNotifications,
};
