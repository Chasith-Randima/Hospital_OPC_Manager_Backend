const Doctor = require("../models/doctorModel");
const factory = require("./handlerFactory");

exports.createOneDoctor = factory.createOne(Doctor);
exports.getOneDoctor = factory.getOne(Doctor, [{ path: "appointments" }]);
exports.getAllDoctors = factory.getAll(Doctor);
exports.updateOneDoctor = factory.updateOne(Doctor);
exports.deleteOneDoctor = factory.deleteOne(Doctor);
