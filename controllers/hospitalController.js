const Hospital = require("..//models/hospitalModel");
const factory = require("./handlerFactory");
const catchAsync = require("../utils/catchAsync");

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
    allPatients
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
