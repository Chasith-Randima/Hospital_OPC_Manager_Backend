const Hospital = require("..//models/hospitalModel");
const factory = require("./handlerFactory");

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
