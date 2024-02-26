const User = require("../model/User");
const jwt = require("jsonwebtoken");

const getAllUsers = async (req, res) => {
  const users = await User.find();
  if (!users) return res.status(204).json({ message: "No users found" });
  res.json(users);
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
  if (!req?.params?.id)
    return res.status(400).json({ message: "User ID required" });
  const user = await User.findOne({ _id: req.params.id }).exec();
  if (!user) {
    return res
      .status(204)
      .json({ message: `User ID ${req.params.id} not found` });
  }
  res.json(user);
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
    suitors,
    user_type_id,
    add_package,
    packages,
    themes,
    selected_theme,
    my_suitors,
    already_seen,
    matches,
    fav_matches,
    last_seen,
    allow_notifications,
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
    if (suitors !== undefined) user.suitors = suitors;
    if (user_type_id !== undefined) user.user_type_id = user_type_id;
    if (add_package !== undefined) user.add_package = add_package;
    if (packages !== undefined) user.packages = packages;
    if (themes !== undefined) user.themes = themes;
    if (selected_theme !== undefined) user.selected_theme = selected_theme;
    if (my_suitors !== undefined) user.my_suitors = my_suitors;
    if (already_seen !== undefined) user.already_seen = already_seen;
    if (matches !== undefined) user.matches = matches;
    if (fav_matches !== undefined) user.fav_matches = fav_matches;
    if (last_seen !== undefined) user.last_seen = last_seen;
    if (allow_notifications !== undefined)
      user.allow_notifications = allow_notifications;
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
  return Math.round((second - first) / (1000 * 60 * 60 * 24));
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

    const users = await User.find({
      _id: { $ne: user_id },
      gender_id: preferred_gender_id,
    }).exec();

    if (users) {
      let finals = users
        .filter((i) => !mainUser.blockeds.includes(i._id)) //Engelliler
        .filter(
          (i) =>
            !mainUser.already_seen
              .filter((j) => {
                if (datediff(j.date, new Date.now()) > 28) {
                  //28 gündür görmedikleri..
                  return j.id;
                }
              })
              .includes(i._id)
        );

      if (finals.length !== 0) {
        mainUser.already_seen = mainUser.already_seen.concat([
          { id: finals[0].id, date: new Date.now() },
        ]);
        await mainUser.save(); //Added to seen list.

        const roles1 = Object.values(mainUser.roles).filter(Boolean);

        //user arragements
        mainUser.roles = roles1;
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

module.exports = {
  getAllUsers,
  deleteUser,
  getUser,
  updateProfile,
  findFortune,
};
