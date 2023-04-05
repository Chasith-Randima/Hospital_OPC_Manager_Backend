const express = require("express");
const router = express.Router();

const authPatient = require("../controllers/authPatientController");
const patientController = require("../controllers/patientController");
const authController = require("../controllers/authController");

router.post("/signup", authPatient.signup);
router.post("/login", authPatient.login);
router.get("/logout", authPatient.logout);

router.use("/search", patientController.searchPatient);

router.use("/image/:imageName", patientController.getImage);

// router.use(authController.protect);
router
  .route("/")
  .get(authController.protect, patientController.getAllPatients)
  .post(
    authPatient.protect,
    patientController.uploadUserImages,
    patientController.resizeUserImages,
    patientController.createOnePatient
  );

router
  .route("/:id")
  .get(authPatient.protect, patientController.getOnePatient)
  .patch(
    authPatient.protect,
    patientController.uploadUserImages,
    patientController.resizeUserImages,
    patientController.updateOnePatient
  )
  .delete(authController.protect, patientController.deleteOnePatient);

router.patch("/updateMyPassword/:id", authPatient.updatePassword);
router.patch("/updateMyPasswordNormal", authPatient.updatePassword);

module.exports = router;
