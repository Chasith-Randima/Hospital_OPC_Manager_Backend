const Ticket = require("../models/ticketModel");
const factory = require("./handlerFactory");

exports.createOneTicket = factory.createOne(Ticket);
exports.getOneTicket = factory.getOne(Ticket);
exports.getAllTickets = factory.getAll(Ticket);
exports.updateOneTicket = factory.updateOne(Ticket);
exports.deleteOneTicket = factory.deleteOne(Ticket);
