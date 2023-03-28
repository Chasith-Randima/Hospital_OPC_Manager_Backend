const User = require("../models/userModel");
const factory = require("./handlerFactory");

exports.createOneUser = factory.createOne(User);
exports.getOneUser = factory.getOne(User);
exports.getAllUser = factory.getAll(User);
exports.updateOneUser = factory.updateOne(User);
exports.deleteOneUser = factory.deleteOne(User);
