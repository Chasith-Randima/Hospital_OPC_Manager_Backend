const Hospital = require("..//models/hospitalModel");
const factory = require("./handlerFactory");
const catchAsync = require("../utils/catchAsync");
const multer = require("multer");
const sharp = require("sharp");
const path = require("path");

// hospital functions

exports.hospitalNameId = catchAsync(async (req, res, next) => {
  const doc = await Hospital.find({}).select({ name: 1, _id: 1 });

  if (doc) {
    res.status(200).json({
      status: "success",
      message: `${doc.length} documents found...`,
      results: doc.length,
      doc,
    });
  }
});

exports.createOneHospital = factory.createOne(Hospital);
// exports.getOneHospital = factory.getOne(Hospital, { path: "appointments" });
exports.getOneHospital = factory.getOne(Hospital, [
  {
    path: "patients",
    //   path: "appointments",
  },
  {
    path: "appointments",
    //   path: "appointments",
  },
  {
    path: "users",
    //   path: "appointments",
  },
  {
    path: "doctors",
    //   path: "appointments",
  },
]);
exports.getAllHospitals = factory.getAll(Hospital);
exports.getAllHospitalsFull = factory.getAll(Hospital, [
  {
    path: "appointments",
    //   path: "appointments",
  },
  {
    path: "doctors",
    //   path: "appointments",
  },
]);
exports.updateOneHospital = factory.updateOne(Hospital);
exports.deleteOneHospital = factory.deleteOne(Hospital);

exports.searchHospitals = catchAsync(async (req, res, next) => {
  const { search } = req.query;
  //   console.log(req.query);
  if (search.length != 0) {
    await Hospital.find({
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
      .populate({
        path: "appointments",
        //   path: "appointments",
      })
      .populate({
        path: "doctors",
        //   path: "appointments",
      })
      .then((doc) => {
        res.status(200).json({
          status: "success",
          message: `${doc.length} found...`,
          results: doc.length,
          doc,
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

exports.updateHospitalArrays = catchAsync(async (req, res, next) => {
  console.log(req.params);
  console.log(req.body);
  const doc = await Hospital.findById(req.params.id);

  if (!doc) {
    return next(new AppError("No document found with that Id", 404));
  }

  if (req.body.patients) {
    req.body.patients.map((patient) => {
      doc.patients.push(patient);
    });
  }
  if (req.body.doctors) {
    req.body.doctors.map((doctor) => {
      doc.doctors.push(doctor);
    });
  }
  if (req.body.users) {
    req.body.users.map((user) => {
      doc.users.push(user);
    });
  }

  doc.save();

  res.status(200).json({
    status: "success",
    message: "Document updated successfully...",
    doc,
  });
});
exports.deleteHospitalArrays = catchAsync(async (req, res, next) => {
  console.log(req.params);
  console.log(req.body);
  const doc = await Hospital.findById(req.params.id);

  if (!doc) {
    return next(new AppError("No document found with that Id", 404));
  }

  if (req.body.patients) {
    req.body.patients.map((patient) => {
      doc.patients.pop(patient);
    });
  }
  if (req.body.doctors) {
    req.body.doctors.map((doctor) => {
      doc.doctors.pop(doctor);
    });
  }
  if (req.body.users) {
    req.body.users.map((user) => {
      doc.users.pop(user);
    });
  }
  doc.save();

  res.status(200).json({
    status: "success",
    message: "Document updated successfully...",
    doc,
  });
});
exports.craeteHospitalNew = catchAsync(async (req, res, next) => {
  console.log(req.params);
  console.log(req.body);
  const doc = await Hospital.findById(req.params.id);

  if (!doc) {
    return next(new AppError("No document found with that Id", 404));
  }

  if (req.body.patients) {
    req.body.patients.map((patient) => {
      doc.patients.push(patient);
    });
  }
  if (req.body.doctors) {
    req.body.doctors.map((doctor) => {
      doc.doctors.push(doctor);
    });
  }
  if (req.body.users) {
    req.body.users.map((user) => {
      doc.users.push(user);
    });
  }

  doc.save();

  res.status(200).json({
    status: "success",
    message: "Document updated successfully...",
    doc,
  });
});
exports.updateHospitalNew = catchAsync(async (req, res, next) => {
  let allPatients;
  let allUsers;
  let allDoctors;

  if (req.body.patients) {
    allPatients = req.body.patients;
    allPatients;
    req.body.patients = undefined;
  }
  if (req.body.users) {
    allUsers = req.body.users;
    req.body.users = undefined;
  }
  if (req.body.doctors) {
    allDoctors = req.body.doctors;
    req.body.doctors = undefined;
  }
  const doc = await Hospital.findByIdAndUpdate(req.params.id, req.body);

  if (!doc) {
    return next(new AppError("No document found with that Id", 404));
  }

  console.log(allPatients, allDoctors, allUsers);

  if (allPatients) {
    allPatients.map((patient) => {
      doc.patients.push(patient);
    });
  }
  if (allDoctors) {
    allDoctors.map((doctor) => {
      doc.doctors.push(doctor);
    });
  }
  if (allUsers) {
    allUsers.map((user) => {
      doc.users.push(user);
    });
  }
  doc.save();

  res.status(200).json({
    status: "success",
    message: "Document updated successfully...",
    doc,
  });
});
// ------------- add images -----------------------

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

exports.uploadHospitalImages = upload.fields([{ name: "images", maxCount: 5 }]);

exports.resizeHospitalImages = catchAsync(async (req, res, next) => {
  // console.log(req.files);
  if (!req.files.images) return next();

  req.body.images = [];

  await Promise.all(
    req.files.images.map(async (file, i) => {
      const filename = `hospital-${req.user._id}-${Date.now()}-${i + 1}.jpeg`;

      await sharp(file.buffer)
        .resize(2400, 1600)
        .toFormat("jpeg")
        .jpeg({ quality: 90 })
        .toFile(`public/img/hospitals/${filename}`);

      req.body.images.push(filename);
    })
  );

  next();
});

exports.getImage = catchAsync(async (req, res) => {
  let fileName = req.params.imageName;

  let options = {
    root: path.join(__dirname, "../public/img/hospitals"),
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
