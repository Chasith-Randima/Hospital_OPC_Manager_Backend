const express = require("express");
const router = express.Router();
const authPatient = require("../controllers/authPatientController");
const authUser = require("../controllers/authController");

const appointmentController = require("../controllers/appointmentController");

router.use("/search", appointmentController.searchAppointment);
router.use("/searchPatients", appointmentController.searchPatientsAppointment);

router
  .route("/")
  .get(appointmentController.getAllAppointment)
  .post(appointmentController.createOneAppointment);

router
  .route("/:id")
  .get(appointmentController.getOneAppointment)
  .patch(authPatient.protect, appointmentController.updateOneAppointment)
  .delete(authPatient.protect, appointmentController.deleteOneAppointment);

router.delete(
  "/user/:id",
  authUser.protect,
  appointmentController.deleteOneAppointment
);

module.exports = router;
