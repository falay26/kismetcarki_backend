const User = require("../model/User");
const bcrypt = require("bcrypt");
//Twillio
var accountSid = process.env.TWILIO_ACCOUNT_SID;
var authToken = process.env.TWILIO_AUTH_TOKEN;

const client = require("twilio")(accountSid, authToken, {
  lazyLoading: true,
});
//Twillio

const handleNewUser = async (req, res) => {
  const {
    phone_code,
    phone,
    name,
    birth_date,
    gender_id,
    city_id,
    profile_picture,
  } = req.body;

  const duplicate = await User.findOne({
    phone_code: phone_code,
    phone: phone,
    verified: true,
  }).exec();
  if (duplicate)
    return res.status(200).json({
      status: 409,
      message: "Telefon numarası kullanımda.",
    });

  try {
    let otp = Math.floor(Math.random() * (999999 - 100000 + 1) + 100000);
    client.messages
      .create({
        body: "Onay kodunuz: " + otp,
        from: "+12542384391",
        to: phone_code + phone,
      })
      .then(() => {})
      .catch(() => {});

    await User.create({
      phone_code: phone_code,
      phone: phone,
      name: name,
      birth_date: birth_date,
      gender_id: gender_id,
      city_id: city_id,
      profile_picture: profile_picture,
      register_otp: otp,
    });

    res.status(200).json({
      status: 200,
      message: `Kullanıcı oluşturuldu!`,
    });
  } catch (err) {
    res.status(500).json({ status: 500, message: err.message });
  }
};

const confirmRegisterOtp = async (req, res) => {
  const { phone_code, phone, otp } = req.body;

  try {
    const user = await User.findOne({
      phone_code: phone_code,
      phone: phone,
    }).exec();

    if (user.register_otp === otp) {
      user.verified = true;
      await user.save();

      res.status(200).json({
        status: 200,
        //TODO: login logic here..
        message: "Kullanıcı başarıyla aktifleştirildi!",
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

const resendRegisterOtp = async (req, res) => {
  const { phone_code, phone } = req.body;

  try {
    const user = await User.findOne({
      phone_code: phone_code,
      phone: phone,
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

    user.register_otp = otp;
    await user.save();

    res.status(200).json({
      status: 200,
      message: "Otp yeniden gönderildi!",
    });
  } catch (err) {
    res.status(500).json({ status: 500, message: err.message });
  }
};

module.exports = { handleNewUser, confirmRegisterOtp, resendRegisterOtp };
