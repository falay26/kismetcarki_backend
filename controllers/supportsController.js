const Support = require("../model/Support");

const getAllSupports = async (req, res) => {
  try {
    const supports = await Support.aggregate([
      { $match: { _id: { $exists: true } } },
      {
        $lookup: {
          from: "branches",
          localField: "branch_id",
          foreignField: "_id",
          as: "branch_info",
        },
      },
    ]);

    res.status(200).json({
      status: 200,
      data: supports,
      message: `Bütün destekler başarı ile döndürüldü!`,
    });
  } catch (err) {
    res.status(500).json({ status: 500, message: err.message });
  }
};

const addSupport = async (req, res) => {
  const { user_id, text } = req.body;

  try {
    const support = await Support.create({
      user_id: user_id,
      text: text,
    });

    res.status(200).json({
      status: 200,
      data: support,
      message: `Destek başarıyla oluşturuldu!`,
    });
  } catch (err) {
    res.status(500).json({ status: 500, message: err.message });
  }
};

module.exports = {
  getAllSupports,
  addSupport,
};
