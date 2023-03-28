const express = require("express");
const router = express.Router();

const authPatient = require("../controllers/authPatientController");
const patientController = require("../controllers/patientController");

router.post("/signup", authPatient.signup);
router.post("/login", authPatient.login);
router.get("/logout", authPatient.logout);

router.use(authPatient.protect);
router
  .route("/")
  .get(patientController.getAllPatients)
  .post(patientController.createOnePatient);

router
  .route("/:id")
  .get(patientController.getOnePatient)
  .patch(patientController.updateOnePatient)
  .delete(patientController.deleteOnePatient);

router.patch("/updateMyPassword/:id", authPatient.updatePassword);
router.patch("/updateMyPasswordNormal", authPatient.updatePassword);

module.exports = router;
