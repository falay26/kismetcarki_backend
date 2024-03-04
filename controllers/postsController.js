const Post = require("../model/Post");
const User = require("../model/User");
const mongoose = require("mongoose");
//Notification
const Notification = require("../model/Notification");
var FCM = require("fcm-node");
var serverKey = process.env.FIREBASE_SERVER_KEY;
var fcm = new FCM(serverKey);

const addPost = async (req, res) => {
  const { owner_id0, owner_id1, content, type } = req.body;

  try {
    await Post.create({
      owner_id0: owner_id0,
      owner_id1: owner_id1,
      content: content,
      type: type,
    });

    const user = await User.findOne({
      _id: owner_id0,
    }).exec();
    const storied_user = await User.findOne({
      _id: owner_id1,
    }).exec();

    var message = {
      to: storied_user.notification_token,
      notification: {
        title: "Kısmet Çarkı",
        body: user.name + " hikayenize güncelleme yaptı.🌷",
      },
    };

    await Notification.create({
      owner_id: storied_user._id,
      type: 2,
      related_id: user._id,
      readed: false,
    });

    fcm.send(message, function (err, response) {
      if (err) {
      } else {
      }
    });

    res.status(200).json({
      status: 200,
      message: `Hikaye eklendi.`,
    });
  } catch (err) {
    res.status(500).json({ status: 500, message: err.message });
  }
};

const getPosts = async (req, res) => {
  const { user_id } = req.body;

  try {
    const posts = await Post.aggregate([
      {
        $match: {
          $or: [
            {
              owner_id0: mongoose.Types.ObjectId(user_id),
            },
            {
              owner_id0: mongoose.Types.ObjectId(user_id),
            },
          ],
        },
      },
    ]);

    res.status(200).json({
      status: 200,
      message: "Hikayeler başarıyla bulundu!",
      posts: posts,
    });
  } catch (err) {
    res.status(500).json({ status: 500, message: err.message });
  }
};

module.exports = {
  addPost,
  getPosts,
};
