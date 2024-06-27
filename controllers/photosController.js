const Photo = require("../model/Photo");
const mongoose = require("mongoose");

const addPhoto = async (req, res) => {
  const { user_id, url } = req.body;

  try {
    await Photo.create({
      owner_id: user_id,
      url: url,
    });

    res.status(200).json({
      status: 200,
      message: `Fotoğraf yüklendi.`,
    });
  } catch (err) {
    res.status(500).json({ status: 500, message: err.message });
  }
};

const getAllPhotos = async (req, res) => {
  const { user_id } = req.body;

  try {
    const photos = await Photo.find({ owner_id: user_id }).sort({
      created_at: -1,
    });

    res.status(200).json({
      status: 200,
      message: "Fotoğraflar başarıyla bulundu!",
      photos: photos,
    });
  } catch (err) {
    res.status(500).json({ status: 500, message: err.message });
  }
};

const deletePhoto = async (req, res) => {
  const { photo_id } = req.body;

  try {
    await Photo.deleteOne({ _id: photo_id }).exec();

    res.status(200).json({
      status: 200,
      message: "Fotoğraf başarıyla silindi!",
    });
  } catch (err) {
    res.status(500).json({ status: 500, message: err.message });
  }
};

module.exports = {
  addPhoto,
  getAllPhotos,
  deletePhoto,
};
