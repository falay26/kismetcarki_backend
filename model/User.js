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
    verified: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

module.exports = mongoose.model("User", userSchema);
