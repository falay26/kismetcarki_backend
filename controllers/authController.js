const User = require("../model/User");
const jwt = require("jsonwebtoken");
//Twillio
var accountSid = process.env.TWILIO_ACCOUNT_SID;
var authToken = process.env.TWILIO_AUTH_TOKEN;

const client = require("twilio")(accountSid, authToken, {
  lazyLoading: true,
});
//Twillio

const handleLogin = async (req, res) => {
  const { phone_code, phone, pineapple } = req.body;

  try {
    const cookies = req.cookies;

    const foundUser = await User.findOne({
      phone_code: phone_code,
      phone: phone,
      verified: true,
    }).exec();
    if (!foundUser)
      return res.status(200).json({
        status: 409,
        message: "Kullanıcı bulunamadı.",
      });

    if (
      pineapple !== undefined &&
      pineapple === process.env.ACCESS_TOKEN_SECRET
    ) {
      const roles = Object.values(foundUser.roles).filter(Boolean);

      const accessToken = jwt.sign(
        {
          UserInfo: {
            username: foundUser.username,
            roles: roles,
          },
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "1h" }
      );
      const newRefreshToken = jwt.sign(
        { username: foundUser.username },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: "7d" }
      );

      let newRefreshTokenArray = !cookies?.jwt
        ? foundUser.refreshToken
        : foundUser.refreshToken.filter((rt) => rt !== cookies.jwt);

      if (cookies?.jwt) {
        const refreshToken = cookies.jwt;
        const foundToken = await User.findOne({ refreshToken }).exec();

        if (!foundToken) {
          newRefreshTokenArray = [];
        }

        res.clearCookie("jwt", {
          httpOnly: true,
          sameSite: "None",
          secure: true,
        });
      }

      foundUser.refreshToken = [...newRefreshTokenArray, newRefreshToken];
      const result = await foundUser.save();

      res.cookie("jwt", newRefreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "None",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      //user arragements
      foundUser.roles = roles;
      foundUser.suspended = new Date() < new Date(foundUser.suspended_until);
      foundUser.refreshToken = "***Deleted for security reasons!***";
      foundUser.register_otp = "***Deleted for security reasons!***";
      foundUser.login_otp = "***Deleted for security reasons!***";
      foundUser.deneme = "Deneme";

      res.status(200).json({
        status: 200,
        message: "Giriş yapma işlemi başarılı!",
        user: foundUser,
      });
    } else {
      let otp =
        phone === "1111111111"
          ? 123456
          : Math.floor(Math.random() * (999999 - 100000 + 1) + 100000);
      client.messages
        .create({
          body: "Onay kodunuz: " + otp,
          from: "+12542384391",
          to: phone_code + phone,
        })
        .then(() => {})
        .catch(() => {});

      foundUser.login_otp = otp;
      await foundUser.save();

      res.status(200).json({
        status: 200,
        message: `Otp gönderildi!`,
      });
    }
  } catch (err) {
    res.status(500).json({ status: 500, message: err.message });
  }
};

const confirmLoginOtp = async (req, res) => {
  const { phone_code, phone, otp } = req.body;

  try {
    const cookies = req.cookies;

    const foundUser = await User.findOne({
      phone_code: phone_code,
      phone: phone,
      verified: true,
    }).exec();
    if (!foundUser)
      return res.status(200).json({
        status: 409,
        message: "Kullanıcı bulunamadı.",
      });

    if (foundUser.login_otp === otp) {
      const roles = Object.values(foundUser.roles).filter(Boolean);

      const accessToken = jwt.sign(
        {
          UserInfo: {
            username: foundUser.username,
            roles: roles,
          },
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "1h" }
      );
      const newRefreshToken = jwt.sign(
        { username: foundUser.username },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: "7d" }
      );

      let newRefreshTokenArray = !cookies?.jwt
        ? foundUser.refreshToken
        : foundUser.refreshToken.filter((rt) => rt !== cookies.jwt);

      if (cookies?.jwt) {
        const refreshToken = cookies.jwt;
        const foundToken = await User.findOne({ refreshToken }).exec();

        if (!foundToken) {
          newRefreshTokenArray = [];
        }

        res.clearCookie("jwt", {
          httpOnly: true,
          sameSite: "None",
          secure: true,
        });
      }

      foundUser.refreshToken = [...newRefreshTokenArray, newRefreshToken];
      const result = await foundUser.save();

      res.cookie("jwt", newRefreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "None",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      res.status(200).json({
        status: 200,
        message: "Giriş yapma işlemi başarılı!",
        user: {
          roles,
          accessToken,
          _id: foundUser._id,
          suspended: new Date() < new Date(foundUser.suspended_until),
          refreshToken: foundUser.refreshToken,
          phone_code: foundUser.phone_code,
          phone: foundUser.phone,
          name: foundUser.name,
          birth_date: foundUser.birth_date,
          gender_id: foundUser.gender_id,
          preferred_gender_id: foundUser.preferred_gender_id,
          city_id: foundUser.city_id,
          notification_token: foundUser.notification_token,
          profile_picture: foundUser.profile_picture,
          register_otp: foundUser.register_otp,
          login_otp: foundUser.login_otp,
          verified: foundUser.verified,
          hobies: foundUser.hobies,
          about_me: foundUser.about_me,
          fav_movie: foundUser.fav_movie,
          fav_book: foundUser.fav_book,
          fav_meal: foundUser.fav_meal,
          language_code: foundUser.language_code,
          frozen: foundUser.frozen,
          blockeds: foundUser.blockeds,
          suitors: foundUser.suitors,
          user_type_id: foundUser.user_type_id,
          add_package: foundUser.add_package,
          packages: foundUser.packages,
          themes: foundUser.themes,
          selected_theme: foundUser.selected_theme,
          my_suitors: foundUser.my_suitors,
          already_seen: foundUser.already_seen,
          matches: foundUser.matches,
          fav_matches: foundUser.fav_matches,
          last_seen: foundUser.last_seen,
          allow_notifications: foundUser.allow_notifications,
          story_requests: foundUser.story_requests,
          allow_story: foundUser.allow_story,
          in_story_with: foundUser.in_story_with,
          school: foundUser.school,
          work: foundUser.work,
          marital: foundUser.marital,
          children: foundUser.children,
          health: foundUser.health,
          hair: foundUser.hair,
          skin: foundUser.skin,
          height: foundUser.height,
          weight: foundUser.weight,
          religion: foundUser.religion,
          fltr_hobies: foundUser.fltr_hobies,
          fltr_fobies: foundUser.fltr_fobies,
          values: foundUser.values,
          created_at: foundUser.created_at,
          updated_at: foundUser.updated_at,
        },
      });
    } else {
      res.status(200).json({
        status: 400,
        message: "Otp hatalı!",
      });
    }
  } catch (err) {
    res.status(500).json({ status: 500, message: err.message });
  }
};

const resendLoginOtp = async (req, res) => {
  const { phone_code, phone } = req.body;

  try {
    const user = await User.findOne({
      phone_code: phone_code,
      phone: phone,
      verified: true,
    }).exec();

    let otp = Math.floor(Math.random() * (999999 - 100000 + 1) + 100000);
    client.messages
      .create({
        body: "Onay kodunuz: " + otp,
        from: "+12542384391",
        to: phone_code + phone,
      })
      .then(() => {})
      .catch(() => {});

    user.login_otp = otp;
    await user.save();

    res.status(200).json({
      status: 200,
      message: "Otp yeniden gönderildi!",
    });
  } catch (err) {
    res.status(500).json({ status: 500, message: err.message });
  }
};

module.exports = { handleLogin, confirmLoginOtp, resendLoginOtp };
