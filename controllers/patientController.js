const Patient = require("../models/patientModel");
const factory = require("./handlerFactory");

exports.createOnePatient = factory.createOne(Patient);
exports.getOnePatient = factory.getOne(Patient, [
  { path: "appointments" },
  { path: "tickets" },
]);
exports.getAllPatients = factory.getAll(Patient);
exports.updateOnePatient = factory.updateOne(Patient);
exports.deleteOnePatient = factory.deleteOne(Patient);
