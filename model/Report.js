const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const reportSchema = new Schema(
  {
    reporter: {
      type: ObjectId,
      required: true,
    },
    reported: {
      type: ObjectId,
      required: true,
    },
    report_type: {
      type: String,
    },
    report: {
      type: String,
    },
    status: {
      type: String,
      default: "0",
    },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

module.exports = mongoose.model("Report", reportSchema);
