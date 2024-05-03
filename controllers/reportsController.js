const Report = require("../model/Report");
var mongoose = require("mongoose");

const reportUser = async (req, res) => {
  const { user_id, suggestion, reported_user, report_type } = req.body;

  try {
    const result = await Report.create({
      reporter: user_id,
      reported: reported_user,
      report: suggestion,
      report_type: report_type,
    });

    res.status(200).json({
      status: 200,
      data: result,
      message: "Şikayet başarıyla oluşturuldu!",
    });
  } catch (err) {
    res.status(500).json({ status: 500, message: err.message });
  }
};

const getAllReports = async (req, res) => {
  const { user_id, report_type } = req.body;

  const reports = await Report.aggregate([
    {
      $match: {
        reporter: mongoose.Types.ObjectId(user_id),
        report_type: report_type,
      },
    },
    {
      $lookup: {
        from: "firms",
        localField: "reported",
        foreignField: "owner_id",
        as: "firm_info",
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "reported",
        foreignField: "_id",
        as: "user_info",
      },
    },
  ]);

  res.status(200).json({
    status: 200,
    data: reports,
    message: "Bütün raporlar başarıyla döndürüldü!",
  });
};

const getReports = async (req, res) => {
  const reports = await Report.find();

  res.status(200).json({
    status: 200,
    data: reports,
    message: "Raporlar başarıyla döndürüldü!",
  });
};

const changeReportStatus = async (req, res) => {
  const { firm_id, status } = req.body;

  try {
    const firm = await Report.findOne({ _id: firm_id }).exec();
    firm.status = status;

    await firm.save();

    res.status(200).json({
      status: 200,
      message: "Rapor başarıyla güncellendi!",
    });
  } catch (err) {
    res.status(500).json({ status: 500, message: err.message });
  }
};

module.exports = { reportUser, getAllReports, getReports, changeReportStatus };
