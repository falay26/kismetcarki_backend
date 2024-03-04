const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const postSchema = new Schema(
  {
    owner_id0: {
      type: ObjectId,
    },
    owner_id1: {
      type: ObjectId,
    },
    content: {
      type: String,
    },
    type: {
      type: String,
    },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

module.exports = mongoose.model("Post", postSchema);
