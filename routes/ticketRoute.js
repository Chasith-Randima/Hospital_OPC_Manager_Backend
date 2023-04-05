const express = require("express");
const router = express.Router();

const ticketController = require("../controllers/ticketController");
const authDoctor = require("../controllers/authDoctorController");

router.use("/search", ticketController.searchTicket);

router
  .route("/")
  .get(ticketController.getAllTickets)
  .post(authDoctor.protect, ticketController.createOneTicket);

router
  .route("/:id")
  .get(ticketController.getOneTicket)
  .patch(authDoctor.protect, ticketController.updateOneTicket)
  .delete(ticketController.deleteOneTicket);

module.exports = router;
