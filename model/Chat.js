const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const chatSchema = new Schema(
  {
    owner_id: {
      type: ObjectId,
    },
    title: {
      type: String,
    },
    sub_title: {
      type: String,
    },
    picture: {
      type: String,
    },
    participants: {
      type: Array,
      default: [],
    },
    messages: {
      type: Array,
      default: [],
    },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

module.exports = mongoose.model("Chat", chatSchema);
