const Appointment = require("../models/appointmentModel");
const factory = require("./handlerFactory");
const catchAsync = require("../utils/catchAsync");

exports.createOneAppointment = factory.createOne(Appointment);
exports.getOneAppointment = factory.getOne(Appointment, [{ path: "tickets" }]);
exports.getAllAppointment = factory.getAll(Appointment);
exports.updateOneAppointment = factory.updateOne(Appointment);
exports.deleteOneAppointment = factory.deleteOne(Appointment);

exports.searchAppointment = catchAsync(async (req, res, next) => {
  const { search } = req.query;
  //   console.log(req.query);
  if (search.length != 0) {
    await Appointment.find({
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
exports.searchPatientsAppointment = catchAsync(async (req, res, next) => {
  const { search, id } = req.query;
  console.log(typeof id, typeof search);
  if (search.length != 0) {
    await Appointment.find({
      $or: [
        //   name: { $regex: search, $options: "i" },
        { name: { $regex: search, $options: "i" } },
        { patients: { $regex: [id], $options: "i" } },
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
