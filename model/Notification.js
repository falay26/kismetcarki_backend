const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const notificationSchema = new Schema(
  {
    owner_id: {
      type: ObjectId,
    },
    type: {
      type: Number,
    },
    related_id: {
      type: ObjectId,
    },
    readed: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

module.exports = mongoose.model("Notification", notificationSchema);
