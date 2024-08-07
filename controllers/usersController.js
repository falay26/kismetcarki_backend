const User = require("../model/User");
const Message = require("../model/Message");
const mongoose = require("mongoose");
//Notification
const Notification = require("../model/Notification");
var FCM = require("fcm-node");
var serverKey = process.env.FIREBASE_SERVER_KEY;
var fcm = new FCM(serverKey);

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({ verified: true });

    res.status(200).json({
      status: 200,
      data: users,
      message: `Bütün kullanıcılar başarı ile döndürüldü!`,
    });
  } catch (err) {
    res.status(500).json({ status: 500, message: err.message });
  }
};

const deleteUser = async (req, res) => {
  if (!req?.body?.id)
    return res.status(400).json({ message: "User ID required" });
  const user = await User.findOne({ _id: req.body.id }).exec();
  if (!user) {
    return res
      .status(204)
      .json({ message: `User ID ${req.body.id} not found` });
  }
  const result = await user.deleteOne({ _id: req.body.id });
  res.json(result);
};

const getUser = async (req, res) => {
  const { user_id } = req.body;

  try {
    const user = await User.findOne({
      _id: user_id,
    }).exec();

    const roles = Object.values(user.roles).filter(Boolean);

    //user arragements
    user.roles = roles;
    user.suspended = new Date() < new Date(user.suspended_until);
    user.refreshToken = "***Deleted for security reasons!***";
    user.register_otp = "***Deleted for security reasons!***";
    user.login_otp = "***Deleted for security reasons!***";

    res.status(200).json({
      status: 200,
      message: "Kullanıcı başarıyla bulundu!",
      user: user,
    });
  } catch (err) {
    res.status(500).json({ status: 500, message: err.message });
  }
};

const getUsers = async (req, res) => {
  const { users } = req.body;

  try {
    const found_users = await User.find({
      _id: { $in: users },
    }).exec();

    res.status(200).json({
      status: 200,
      message: "Kullanıcılar başarıyla bulundu!",
      users: found_users,
    });
  } catch (err) {
    res.status(500).json({ status: 500, message: err.message });
  }
};

const updateProfile = async (req, res) => {
  const {
    user_id,
    phone_code,
    phone,
    name,
    birth_date,
    preferred_gender_id,
    gender_id,
    city_id,
    notification_token,
    profile_picture,
    verified,
    hobies,
    about_me,
    fav_movie,
    fav_book,
    fav_meal,
    language_code,
    frozen,
    blockeds,
    blocked_chats,
    suitors,
    user_type_id,
    add_package,
    packages,
    themes,
    selected_theme,
    my_suitors,
    already_seen,
    matches,
    unmatched_user_id, //To use
    message_id, //To use
    fav_matches,
    last_seen,
    allow_notifications,
    story_requests,
    allow_story,
    in_story_with,
    //Filters
    school,
    work,
    marital,
    children,
    health,
    hair,
    skin,
    height,
    weight,
    religion,
    fltr_hobies,
    fltr_fobies,
    values,
  } = req.body;

  try {
    const user = await User.findOne({
      _id: user_id,
    }).exec();

    if (!user) return res.status(400).json({ message: "User not found" });
    if (phone_code !== undefined) user.phone_code = phone_code;
    if (phone !== undefined) user.phone = phone;
    if (name !== undefined) user.name = name;
    if (birth_date !== undefined) user.birth_date = birth_date;
    if (preferred_gender_id !== undefined)
      user.preferred_gender_id = preferred_gender_id;
    if (gender_id !== undefined) user.gender_id = gender_id;
    if (city_id !== undefined) user.city_id = city_id;
    if (notification_token !== undefined)
      user.notification_token = notification_token;
    if (profile_picture !== undefined) user.profile_picture = profile_picture;
    if (verified !== undefined) user.verified = verified;
    if (hobies !== undefined) user.hobies = hobies;
    if (about_me !== undefined) user.about_me = about_me;
    if (fav_movie !== undefined) user.fav_movie = fav_movie;
    if (fav_book !== undefined) user.fav_book = fav_book;
    if (fav_meal !== undefined) user.fav_meal = fav_meal;
    if (language_code !== undefined) user.language_code = language_code;
    if (frozen !== undefined) user.frozen = frozen;
    if (blockeds !== undefined) user.blockeds = blockeds;
    if (blocked_chats !== undefined) user.blocked_chats = blocked_chats;
    if (suitors !== undefined) {
      let date = new Date();
      user.suitors = suitors;
      let suitted_id = suitors[suitors.length - 1].id;
      const suitted_user = await User.findOne({
        _id: suitted_id,
      }).exec();
      if (
        suitted_user.my_suitors.filter((i) => i.id === user_id).length === 0
      ) {
        suitted_user.my_suitors = suitted_user.my_suitors.concat([
          { id: user_id, date: date, seen: false },
        ]);
        await suitted_user.markModified("my_suitors");
        await suitted_user.save();

        var message = {
          to: suitted_user.notification_token,
          notification: {
            title: "Kısmet Çarkı",
            body: user.name + " sana talip oldu.👩‍❤️‍👨💟",
          },
        };

        await Notification.create({
          owner_id: suitted_user._id,
          type: 0,
          related_id: user._id,
          readed: false,
        });

        fcm.send(message, function (err, response) {
          if (err) {
          } else {
          }
        });
      }
    }
    if (user_type_id !== undefined) {
      user.user_type_id = user_type_id;

      await Notification.create({
        owner_id: user._id,
        type: 4,
        related_id: null,
        readed: false,
      });
    }
    if (add_package !== undefined) {
      user.add_package = add_package;

      await Notification.create({
        owner_id: user._id,
        type: 3,
        related_id: null,
        readed: false,
      });
    }
    if (packages !== undefined) user.packages = packages;
    if (themes !== undefined) user.themes = themes;
    if (selected_theme !== undefined) user.selected_theme = selected_theme;
    if (my_suitors !== undefined) user.my_suitors = my_suitors;
    if (already_seen !== undefined) user.already_seen = already_seen;
    if (matches !== undefined) {
      if (matches.length > user.matches.length) {
        user.matches = matches;
        user.my_suitors = user.my_suitors.map((i) => {
          if (i.id !== matches[matches.length - 1]) {
            return i;
          } else {
            let new_i = { id: i.id, date: i.date, seen: true };
            return new_i;
          }
        });
        let matched_id = matches[matches.length - 1];
        const matched_user = await User.findOne({
          _id: matched_id,
        }).exec();
        matched_user.matches = matched_user.matches.concat([user_id]);
        await matched_user.save();

        const messages = await Message.aggregate([
          {
            $match: {
              $or: [
                {
                  sender_id: mongoose.Types.ObjectId(user_id),
                  reciever_id: mongoose.Types.ObjectId(matched_id),
                },
                {
                  sender_id: mongoose.Types.ObjectId(matched_id),
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

        if (messages.length === 0) {
          await Message.create({
            sender_id: user_id,
            reciever_id: matched_id,
          });
          //Mesajlar başarıyla oluşturuldu.
        }

        var message = {
          to: matched_user.notification_token,
          notification: {
            title: "Kısmet Çarkı",
            body: user.name + " talip olma istegini kabul etti.💌💌",
          },
        };

        await Notification.create({
          owner_id: matched_user._id,
          type: 0,
          related_id: user._id,
          readed: false,
        });

        fcm.send(message, function (err, response) {
          if (err) {
          } else {
          }
        });
      } else {
        user.matches = matches;
        const matched_user = await User.findOne({
          _id: unmatched_user_id,
        }).exec();
        matched_user.matches = matched_user.matches.filter(
          (i) => i !== user_id
        );
        await matched_user.save();
        await Message.findOneAndDelete({
          _id: message_id,
        });
      }
    }
    if (fav_matches !== undefined) user.fav_matches = fav_matches;
    if (last_seen !== undefined) user.last_seen = last_seen;
    if (allow_notifications !== undefined)
      user.allow_notifications = allow_notifications;
    if (story_requests !== undefined) {
      user.story_requests = story_requests;

      const storied_id = story_requests[story_requests.length - 1];
      const storied_user = await User.findOne({
        _id: storied_id,
      }).exec();

      var message = {
        to: storied_user.notification_token,
        notification: {
          title: "Kısmet Çarkı",
          body: user.name + " ortak hikaye talebi gönderdi.💌",
        },
      };

      await Notification.create({
        owner_id: storied_user._id,
        type: 6,
        related_id: user._id,
        readed: false,
      });

      fcm.send(message, function (err, response) {
        if (err) {
        } else {
        }
      });
    }
    if (allow_story !== undefined) user.allow_story = allow_story;
    if (in_story_with !== undefined) {
      user.in_story_with = in_story_with;

      const storied_id = in_story_with;
      const storied_user = await User.findOne({
        _id: storied_id,
      }).exec();

      storied_user.story_requests = storied_user.story_requests.filter(
        (i) => i !== user._id
      );
      storied_user.in_story_with = user._id;
      await storied_user.save();
    }
    if (school !== undefined) user.school = school;
    if (school !== undefined) user.school = school;
    if (work !== undefined) user.work = work;
    if (marital !== undefined) user.marital = marital;
    if (children !== undefined) user.children = children;
    if (health !== undefined) user.health = health;
    if (hair !== undefined) user.hair = hair;
    if (skin !== undefined) user.skin = skin;
    if (height !== undefined) user.height = height;
    if (weight !== undefined) user.weight = weight;
    if (religion !== undefined) user.religion = religion;
    if (fltr_hobies !== undefined) user.fltr_hobies = fltr_hobies;
    if (fltr_fobies !== undefined) user.fltr_fobies = fltr_fobies;
    if (values !== undefined) user.values = values;

    await user.save();
    const roles = Object.values(user.roles).filter(Boolean);

    //user arragements
    user.roles = roles;
    user.suspended = new Date() < new Date(user.suspended_until);
    user.refreshToken = "***Deleted for security reasons!***";
    user.register_otp = "***Deleted for security reasons!***";
    user.login_otp = "***Deleted for security reasons!***";

    res.status(200).json({
      status: 200,
      message: "Kullanıcı başarıyla güncellendi!",
      user: user,
    });
  } catch (err) {
    res.status(500).json({ status: 500, message: err.message });
  }
};

function datediff(first, second) {
  return Math.round(
    (Date.parse(second) - Date.parse(first)) / (1000 * 60 * 60 * 24)
  );
}

const findFortune = async (req, res) => {
  const { user_id, preferred_gender_id, filters } = req.body;

  try {
    const mainUser = await User.findOne({
      _id: user_id,
    }).exec();
    if (!mainUser)
      return res.status(400).json({
        status: 400,
        message: "Kullanıcı bulunamadı.",
      });

    let non_includers = mainUser.blockeds
      .concat(mainUser.suitors.map((i) => i.id))
      .concat(mainUser.my_suitors.map((i) => i.id))
      .concat(mainUser.matches)
      .map((i) => mongoose.Types.ObjectId(i));

    let used_gender =
      preferred_gender_id?.length === 0 || preferred_gender_id?.length === 2
        ? ["0", "1", "2"]
        : preferred_gender_id;
    let used_school =
      filters?.education?.length === 0 || filters?.education?.length === 7
        ? [null, 1, 2, 3, 4, 5, 6, 7]
        : filters?.education.map((i) => Number(i));
    let used_work =
      filters?.work?.length === 0 || filters?.work?.length === 7
        ? [null, 1, 2, 3, 4, 5, 6, 7]
        : filters?.work?.map((i) => Number(i));
    let used_marital =
      filters?.marital?.length === 0 || filters?.marital?.length === 2
        ? [null, 1, 2]
        : filters?.marital?.map((i) => Number(i));
    let used_children =
      filters?.children?.length === 0 || filters?.children?.length === 2
        ? [null, 1, 2]
        : filters?.children?.map((i) => Number(i));
    let used_health =
      filters?.health?.length === 0 || filters?.health?.length === 2
        ? [null, 1, 2]
        : filters?.health?.map((i) => Number(i));
    let used_hair =
      filters?.hair?.length === 0 || filters?.hair?.length === 3
        ? [null, 1, 2, 3]
        : filters?.hair?.map((i) => Number(i));
    let used_skin =
      filters?.skin?.length === 0 || filters?.skin?.length === 3
        ? [null, 1, 2, 3]
        : filters?.skin?.map((i) => Number(i));
    let used_religion =
      filters?.faith?.length === 0 || filters?.faith?.length === 3
        ? [null, 1, 2, 3, 4, 5, 6, 7]
        : filters?.faith?.map((i) => Number(i));

    const users = await User.find({
      _id: { $ne: user_id, $nin: non_includers },
      gender_id: { $in: used_gender },
      school: { $in: used_school },
      work: { $in: used_work },
      marital: { $in: used_marital },
      children: { $in: used_children },
      health: { $in: used_health },
      hair: { $in: used_hair },
      skin: { $in: used_skin },
      religion: { $in: used_religion },
      verified: true,
    }).exec();

    if (users) {
      let seen_list = mainUser.already_seen
        .filter((i) => {
          if (datediff(i.date, new Date()) < 1) {
            return i.id;
          }
        })
        .map((i) => i.id);

      let finals = users
        .filter((i) => !mainUser.blockeds.includes(i._id)) //Engelliler.
        .filter((j) => !seen_list.includes(j.id)); //28 gün içinde görülenler.

      if (finals.length !== 0) {
        let date = new Date();
        mainUser.already_seen = mainUser.already_seen.concat([
          { id: finals[0].id, date: date },
        ]);
        await mainUser.save(); //Added to seen list.

        const roles1 = Object.values(mainUser.roles).filter(Boolean);

        //user arragements
        mainUser.roles = roles1;
        mainUser.suspended = new Date() < new Date(mainUser.suspended_until);
        mainUser.refreshToken = "***Deleted for security reasons!***";
        mainUser.register_otp = "***Deleted for security reasons!***";
        mainUser.login_otp = "***Deleted for security reasons!***";

        const roles = Object.values(finals[0].roles).filter(Boolean);

        //user arragements
        finals[0].roles = roles;
        finals[0].refreshToken = "***Deleted for security reasons!***";
        finals[0].register_otp = "***Deleted for security reasons!***";
        finals[0].login_otp = "***Deleted for security reasons!***";

        res.status(200).json({
          status: 200,
          message: "Kullanıcı başarıyla bulundu!",
          user: finals[0],
          main_user: mainUser,
        });
      } else {
        res.status(400).json({
          status: 400,
          message: "Kullanıcı bulunamadı.",
        });
      }
    } else {
      res.status(400).json({
        status: 400,
        message: "Kullanıcı bulunamadı.",
      });
    }
  } catch (err) {
    res.status(500).json({ status: 500, message: err.message });
  }
};

const suspendUser = async (req, res) => {
  const { user_id, month } = req.body;

  try {
    const user = await User.findOne({
      _id: user_id,
    }).exec();

    user.suspended_until = new Date(
      new Date().getTime() + month * 30 * 24 * 60 * 60 * 1000
    );
    await user.save();

    res.status(200).json({
      status: 200,
      message: "Kullanıcı başarıyla askıya alındı!",
    });
  } catch (err) {
    res.status(500).json({ status: 500, message: err.message });
  }
};

module.exports = {
  getAllUsers,
  deleteUser,
  getUser,
  getUsers,
  updateProfile,
  findFortune,
  suspendUser,
};
