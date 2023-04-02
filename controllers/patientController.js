const Patient = require("../models/patientModel");
const factory = require("./handlerFactory");
const multer = require("multer");
const sharp = require("sharp");
const path = require("path");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const mongoose = require("mongoose");

// patient controllers

const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new AppError("Not an Image Please upload only an image..", 400), false);
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

exports.uploadUserImages = upload.fields([{ name: "images", maxCount: 5 }]);

exports.resizeUserImages = catchAsync(async (req, res, next) => {
  console.log(!req.files.images);
  if (!req.files.images) return next();

  req.body.images = [];

  await Promise.all(
    req.files.images.map(async (file, i) => {
      const filename = `patient-${req.patient._id}-${Date.now()}-${i + 1}.jpeg`;

      await sharp(file.buffer)
        .resize(2400, 1600)
        .toFormat("jpeg")
        .jpeg({ quality: 90 })
        .toFile(`public/img/patients/${filename}`);

      req.body.images.push(filename);
    })
  );

  next();
});

exports.getImage = catchAsync(async (req, res) => {
  let fileName = req.params.imageName;

  let options = {
    root: path.join(__dirname, "../public/img/patients"),
    dotfiles: "deny",
    headers: {
      "x-timestamp": Date.now(),
      "x-sent": true,
    },
  };

  res.sendFile(fileName, options, function (err) {
    if (err) {
      res.status(500).json({
        err,
      });
    } else {
      console.log("Sent:", fileName);
    }
  });
});

exports.createOnePatient = factory.createOne(Patient);
exports.getOnePatient = factory.getOne(Patient, [
  { path: "appointments" },
  { path: "tickets" },
]);
exports.getAllPatients = factory.getAll(Patient);
exports.updateOnePatient = factory.updateOne(Patient);
exports.deleteOnePatient = factory.deleteOne(Patient);

exports.searchPatient = catchAsync(async (req, res, next) => {
  const { search } = req.query;
  //   console.log(req.query);
  if (search.length != 0) {
    await Patient.find({
      $or: [
        //   name: { $regex: search, $options: "i" },
        { name: { $regex: search, $options: "i" } },
        // { _id: { $regex: search, $options: "i" } },
        //   _id: { $regex: search, $options: "i" },
        // { active: { $regex: search, $options: "i" } },
        // { patients: { $regex: search, $options: "i" } },
        // { hospitals: { $regex: search, $options: "i" } },
        // { appointmentDate: { $regex: search, $options: "i" } },
      ],
    })
      .then((data) => {
        res.status(200).json({
          status: "success",
          message: `${data.length} found...`,
          data,
        });
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json({
          satus: "failed",
          message: err,
        });
      });
  }
});

exports.getPatientsByCityAndHospital = catchAsync(async (req, res, next) => {
  console.log(req.query);
  const city = req.query.city;
  const hospitalID = req.query.hospitalId;
  // console.log(hospitalID);
  let ObjectId = new mongoose.Types.ObjectId(hospitalID);
  // console.log(ObjectId);
  stats = await Patient.aggregate([
    {
      $match: {
        hospitals: { $in: [ObjectId] },
      },
    },
    { $group: { _id: "$city", count: { $sum: 1 } } },
  ]);

  res.status(200).json({
    status: "success",
    stats,
  });
});
exports.getAllPatientsByCity = catchAsync(async (req, res, next) => {
  // console.log(ObjectId);
  stats = await Patient.aggregate([
    { $group: { _id: "$city", count: { $sum: 1 } } },
  ]);

  res.status(200).json({
    status: "success",
    stats,
  });
});
