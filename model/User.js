const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

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
      default: "0",
    },
    preferred_gender_id: {
      type: String,
      default: "0",
    },
    city_id: {
      type: String,
    },
    notification_token: {
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
      default: "",
    },
    fav_movie: {
      type: String,
      default: "",
    },
    fav_book: {
      type: String,
      default: "",
    },
    fav_meal: {
      type: String,
      default: "",
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
    blocked_chats: {
      type: Array,
      default: [],
    },
    suitors: {
      type: Array,
      default: [],
    },
    user_type_id: {
      type: String,
      default: "0",
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
    story_requests: {
      type: Array,
      default: [],
    },
    allow_story: {
      type: Boolean,
      default: true,
    },
    in_story_with: {
      type: ObjectId,
      default: null,
    },
    //Filters
    school: {
      type: Number,
      default: null,
    },
    work: {
      type: Number,
      default: null,
    },
    marital: {
      type: Number,
      default: null,
    },
    children: {
      type: Number,
      default: null,
    },
    health: {
      type: Number,
      default: null,
    },
    hair: {
      type: Number,
      default: null,
    },
    skin: {
      type: Number,
      default: null,
    },
    height: {
      type: Number,
      default: null,
    },
    weight: {
      type: Number,
      default: null,
    },
    religion: {
      type: Number,
      default: null,
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
