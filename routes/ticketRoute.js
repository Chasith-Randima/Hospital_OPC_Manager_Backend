const express = require("express");
const router = express.Router();

const ticketController = require("../controllers/ticketController");
const authDoctor = require("../controllers/authDoctorController");
const authController = require("../controllers/authController");

// all tckets routes

router.use("/search", ticketController.searchTicket);

router
  .route("/")
  .get(ticketController.getAllTickets)
  .post(authDoctor.protect, ticketController.createOneTicket);

router
  .route("/:id")
  .get(ticketController.getOneTicket)
  .patch(authController.protect, ticketController.updateOneTicket)
  .delete(ticketController.deleteOneTicket);

module.exports = router;
