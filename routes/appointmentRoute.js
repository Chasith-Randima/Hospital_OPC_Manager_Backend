const express = require("express");
const router = express.Router();

const appointmentController = require("../controllers/appointmentController");

router
  .route("/")
  .get(appointmentController.getAllAppointment)
  .post(appointmentController.createOneAppointment);

router
  .route("/:id")
  .get(appointmentController.getOneAppointment)
  .patch(appointmentController.updateOneAppointment)
  .delete(appointmentController.deleteOneAppointment);

module.exports = router;
