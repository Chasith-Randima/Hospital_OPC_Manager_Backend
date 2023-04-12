const Ticket = require("../models/ticketModel");
const factory = require("./handlerFactory");
const catchAsync = require("../utils/catchAsync");

// tickets functions

exports.createOneTicket = factory.createOne(Ticket);
exports.getOneTicket = factory.getOne(Ticket);
exports.getAllTickets = factory.getAll(Ticket);
exports.updateOneTicket = factory.updateOne(Ticket);
exports.deleteOneTicket = factory.deleteOne(Ticket);

exports.searchTicket = catchAsync(async (req, res, next) => {
  const { search } = req.query;

  if (search.length != 0) {
    await Ticket.find({
      $or: [
        //   name: { $regex: search, $options: "i" },
        { diagnosisTitle: { $regex: search, $options: "i" } },
        { diagnosis: { $regex: search, $options: "i" } },
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
