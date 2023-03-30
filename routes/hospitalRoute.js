const express = require("express");
const router = express.Router();

const authController = require("../controllers/authController");
const hospitalController = require("../controllers/hospitalController");
const userController = require("../controllers/userController");

router.get("/full", hospitalController.getAllHospitalsFull);

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
