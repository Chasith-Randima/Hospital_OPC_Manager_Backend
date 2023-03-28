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
]);
exports.getAllHospitals = factory.getAll(Hospital);
exports.updateOneHospital = factory.updateOne(Hospital);
exports.deleteOneHospital = factory.deleteOne(Hospital);
