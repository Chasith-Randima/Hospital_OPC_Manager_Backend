const express = require("express");
const router = express.Router();

const authController = require("../controllers/authController");
const hospitalController = require("../controllers/hospitalController");
const userController = require("../controllers/userController");

router.get("/full", hospitalController.getAllHospitalsFull);

router.patch(
  "/updatePatientsArray/:id",
  hospitalController.updateHospitalArrays
);
router.patch(
  "/deletePatientsArray/:id",
  hospitalController.deleteHospitalArrays
);

router.patch("/updateHospitalNew/:id", hospitalController.updateHospitalNew);

router.use("/search", hospitalController.searchHospitals);

router
  .route("/")
  .get(hospitalController.getAllHospitals)
  .post(authController.protect, hospitalController.createOneHospital);

router
  .route("/:id")
  .get(hospitalController.getOneHospital)
  .patch(authController.protect, hospitalController.updateOneHospital)
  .delete(authController.protect, hospitalController.deleteOneHospital);

module.exports = router;
