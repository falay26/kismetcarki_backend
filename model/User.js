const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    roles: {
      User: {
        type: Number,
        default: 2001,
      },
      Editor: Number,
      Admin: Number,
    },
    refreshToken: [String],
    phone_code: {
      type: String,
      default: "+90",
    },
    phone: {
      type: String,
      required: true,
    },
    name: {
      type: String,
    },
    birth_date: {
      type: String,
    },
    gender_id: {
      type: String,
    },
    city_id: {
      type: String,
    },
    profile_picture: {
      type: String,
    },
    register_otp: {
      type: String,
    },
    login_otp: {
      type: String,
    },
    verified: {
      type: Boolean,
      default: false,
    },
    hobies: {
      type: Array,
      default: [],
    },
    about_me: {
      type: String,
    },
    fav_movie: {
      type: String,
    },
    fav_book: {
      type: String,
    },
    fav_meal: {
      type: String,
    },
    language_code: {
      type: String,
      default: "tr",
    },
    frozen: {
      type: Boolean,
      default: false,
    },
    blockeds: {
      type: Array,
      default: [],
    },
    suitors: {
      type: Array,
      default: [],
    },
    user_type_id: {
      type: String,
    },
    add_package: {
      type: Boolean,
      default: false,
    },
    packages: {
      type: Array,
      default: [],
    },
    themes: {
      type: Array,
      default: [],
    },
    selected_theme: {
      type: String,
      default: "00",
    },
    my_suitors: {
      type: Array,
      default: [],
    },
    already_seen: {
      type: Array,
      default: [],
    },
    matches: {
      type: Array,
      default: [],
    },
    fav_matches: {
      type: Array,
      default: [],
    },
    last_seen: {
      type: String,
    },
    allow_notifications: {
      type: Boolean,
      default: true,
    },
    //Filters
    school: {
      type: String,
      default: "",
    },
    work: {
      type: String,
      default: "",
    },
    marital: {
      type: String,
      default: "",
    },
    children: {
      type: String,
      default: "",
    },
    health: {
      type: String,
      default: "",
    },
    hair: {
      type: String,
      default: "",
    },
    skin: {
      type: String,
      default: "",
    },
    height: {
      type: Number,
    },
    weight: {
      type: Number,
    },
    religion: {
      type: String,
      default: "",
    },
    fltr_hobies: {
      type: Array,
      default: [],
    },
    fltr_fobies: {
      type: Array,
      default: [],
    },
    values: {
      type: Array,
      default: [],
    },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

module.exports = mongoose.model("User", userSchema);
