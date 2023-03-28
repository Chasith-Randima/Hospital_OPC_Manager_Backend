const Appointment = require("../models/appointmentModel");
const factory = require("./handlerFactory");

exports.createOneAppointment = factory.createOne(Appointment);
exports.getOneAppointment = factory.getOne(Appointment, [{ path: "tickets" }]);
exports.getAllAppointment = factory.getAll(Appointment);
exports.updateOneAppointment = factory.updateOne(Appointment);
exports.deleteOneAppointment = factory.deleteOne(Appointment);
