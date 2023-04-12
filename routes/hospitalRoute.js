const express = require("express");
const router = express.Router();

const authController = require("../controllers/authController");
const hospitalController = require("../controllers/hospitalController");
const userController = require("../controllers/userController");

router.get("/full", hospitalController.getAllHospitalsFull);

router.get("/hospitalsNameId", hospitalController.hospitalNameId);

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

router.use("/image/:imageName", hospitalController.getImage);

router
  .route("/")
  .get(hospitalController.getAllHospitals)
  .post(
    authController.protect,
    hospitalController.uploadHospitalImages,
    hospitalController.resizeHospitalImages,
    hospitalController.createOneHospital
  );

router
  .route("/:id")
  .get(hospitalController.getOneHospital)
  .patch(
    authController.protect,
    hospitalController.uploadHospitalImages,
    hospitalController.resizeHospitalImages,
    hospitalController.updateOneHospital
  )
  .delete(authController.protect, hospitalController.deleteOneHospital);

module.exports = router;
