const express = require("express");
const router = express.Router();

const ticketController = require("../controllers/ticketController");

router
  .route("/")
  .get(ticketController.getAllTickets)
  .post(ticketController.createOneTicket);

router
  .route("/:id")
  .get(ticketController.getOneTicket)
  .patch(ticketController.updateOneTicket)
  .delete(ticketController.deleteOneTicket);

module.exports = router;
