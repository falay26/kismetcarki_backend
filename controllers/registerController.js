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

    const user = await User.create({
      phone_code: phone_code,
      phone: phone,
      name: name,
      birth_date: birth_date,
      gender_id: gender_id,
      city_id: city_id,
      profile_picture: profile_picture,
      register_otp: otp,
    });

    const roles1 = Object.values(user.roles).filter(Boolean);

    //user arragements
    user.roles = roles1;
    user.suspended = new Date() < new Date(user.suspended_until);
    user.refreshToken = "***Deleted for security reasons!***";
    user.register_otp = "***Deleted for security reasons!***";
    user.login_otp = "***Deleted for security reasons!***";

    res.status(200).json({
      status: 200,
      message: `Kullanıcı oluşturuldu!`,
      user: user,
    });
  } catch (err) {
    res.status(500).json({ status: 500, message: err.message });
  }
};

const confirmRegisterOtp = async (req, res) => {
  const { phone_code, phone, otp } = req.body;

  try {
    const user = await User.find({
      phone_code: phone_code,
      phone: phone,
    })
      .sort({ created_at: -1 })
      .limit(1)
      .exec();

    if (user.register_otp === otp) {
      user.verified = true;
      await user.save();

      const roles = Object.values(user.roles).filter(Boolean);

      res.status(200).json({
        status: 200,
        user: {
          roles,
          suspended: new Date() < new Date(user.suspended_until),
          name: user.name,
          phone_code: user.phone_code,
          phone: user.phone,
          birth_date: user.birth_date,
          gender_id: user.gender_id,
          city_id: user.city_id,
          profile_picture: user.profile_picture,
          _id: user._id,
        },
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
    })
      .sort({ created_at: -1 })
      .limit(1)
      .exec();

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

const createNewUsers = async (req, res) => {
  const {} = req.body;

  try {
    console.log("GİRDİ!");
    let array = new Array(50);
    let male_names = [
      "Mehmet",
      "Mustafa",
      "Ahmet",
      "Ali",
      "Hüseyin",
      "Hasan",
      "Murat",
      "Yusuf",
      "İbrahim",
      "İsmail",
      "Ömer",
      "Ramazan",
      "Osman",
      "Abdullah",
      "Fatih",
      "Emre",
      "Halil",
      "Süleyman",
      "Hakan",
      "Adem",
      "Muhammed",
      "Kadir",
      "Furkan",
      "Mahmut",
      "Burak",
    ];
    let female_names = [
      "Fatma",
      "Ayşe",
      "Emine",
      "Hatice",
      "Zeynep",
      "Elif",
      "Meryem",
      "Merve",
      "Zehra",
      "Esra",
      "Özlem",
      "Büşra",
      "Yasemin",
      "Hülya",
      "Melek",
      "Sultan",
      "Kübra",
      "Dilek",
      "Rabia",
      "Leyla",
      "Songül",
      "Aysel",
      "Sevim",
      "Hacer",
      "Tuğba",
    ];
    let cities = ["34", "06", "35", "16", "07"];
    let last_names = [
      "A.",
      "E.",
      "C.",
      "B.",
      "N.",
      "M.",
      "P.",
      "S.",
      "R.",
      "Y.",
      "T.",
      "K.",
      "Ö.",
      "F.",
    ];
    [...array].map(async (i, index) => {
      let last_2_digits = index.toString().length === 1 ? "0" + index : index;
      let phone = "50000000" + last_2_digits;
      let gender_id = index < 25 ? "2" : "1";
      let gender_index = index < 25 ? index : index % 25;
      let birth_date = "1995-07-22T11:52:10.000Z";
      let name =
        (gender_id === "2"
          ? male_names[gender_index]
          : female_names[gender_index]) +
        " " +
        last_names[Math.floor(Math.random() * last_names.length)];
      let city_id = cities[Math.floor(Math.random() * cities.length)];
      let verified = true;
      await User.create({
        phone: phone,
        name: name,
        birth_date: birth_date,
        gender_id: gender_id,
        city_id: city_id,
        profile_picture: "",
      });
    });
    /*
    await User.create({
      phone: phone,
      name: name,
      birth_date: birth_date,
      gender_id: gender_id,
      city_id: city_id,
      profile_picture: '',
    });
    */

    res.status(200).json({
      status: 200,
      message: `Kullanıcı oluşturuldu!`,
    });
  } catch (err) {
    res.status(500).json({ status: 500, message: err.message });
  }
};

module.exports = {
  handleNewUser,
  confirmRegisterOtp,
  resendRegisterOtp,
  createNewUsers,
};
