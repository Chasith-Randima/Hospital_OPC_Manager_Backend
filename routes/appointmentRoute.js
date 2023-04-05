const express = require("express");
const router = express.Router();
const authPatient = require("../controllers/authPatientController");
const authUser = require("../controllers/authController");

const appointmentController = require("../controllers/appointmentController");

router.use("/search", appointmentController.searchAppointment);
router.use("/searchPatients", appointmentController.searchPatientsAppointment);

router.use(
  "/appointmentTimeStats",
  appointmentController.getAppointmentStatsclsoded
);

router.use(
  "/appointmentTimeStatsByMonth/",
  appointmentController.getAppointmentStatsByMonth
);
router.use(
  "/appointmentTimeStatsByYear/",
  appointmentController.getAppointmentStatsByYear
);
router.use(
  "/appointmentTimeStatsMonth",
  appointmentController.getAppointmentStatsMonth
);

router.use(
  "/getAppointmentsByTimeHospital",
  appointmentController.getAppointmentsByTimeHospital
);
router.use(
  "/getAppointmentsByTime",
  appointmentController.getAppointmentsByTime
);
router.use(
  "/getAppointmentsByDateHospital",
  appointmentController.getAppointmentsByDateHospital
);
router.use(
  "/getAllAppointmentsByDate",
  appointmentController.getAllAppointmentsByDate
);

router
  .route("/")
  .get(appointmentController.getAllAppointment)
  .post(appointmentController.createOneAppointment);

router
  .route("/:id")
  .get(appointmentController.getOneAppointment)
  .patch(appointmentController.updateOneAppointment)
  // .patch(authPatient.protect, appointmentController.updateOneAppointment)
  .delete(authPatient.protect, appointmentController.deleteOneAppointment);

router.delete(
  "/user/:id",
  authUser.protect,
  appointmentController.deleteOneAppointment
);

module.exports = router;
