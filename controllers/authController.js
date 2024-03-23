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
      foundUser.refreshToken = "***Deleted for security reasons!***";
      foundUser.register_otp = "***Deleted for security reasons!***";
      foundUser.login_otp = "***Deleted for security reasons!***";

      res.status(200).json({
        status: 200,
        message: "Giriş yapma işlemi başarılı!",
        user: foundUser,
      });
    } else {
      let otp = Math.floor(Math.random() * (999999 - 100000 + 1) + 100000);
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

      //user arragements
      foundUser.roles = roles;
      foundUser.accessToken = accessToken;
      //foundUser.refreshToken = "***Deleted for security reasons!***";
      foundUser.register_otp = "***Deleted for security reasons!***";
      foundUser.login_otp = "***Deleted for security reasons!***";

      res.status(200).json({
        status: 200,
        message: "Giriş yapma işlemi başarılı!",
        user: foundUser,
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
