const express = require("express");
const router = express.Router();
const authDoctor = require("../controllers/authDoctorController");
const doctorController = require("../controllers/doctorController");
const authController = require("../controllers/authController");

router.post("/signup", authDoctor.signup);
router.post("/login", authDoctor.login);
router.get("/logout", authDoctor.logout);

router.use("/search", doctorController.searchDoctor);
router.use("/image/:imageName", doctorController.getImage);

router.patch(
  "/updateDoctorRole/:id",
  authController.protect,
  doctorController.updateOneDoctor
);

// router.use(authDoctor.protect);

router.get("/allDoctors", doctorController.getAllDoctors);

router
  .route("/")
  .get(doctorController.getAllDoctors)
  .post(
    authDoctor.protect,
    doctorController.uploadUserImages,
    doctorController.resizeUserImages,
    doctorController.createOneDoctor
  );

router
  .route("/:id")
  .get(doctorController.getOneDoctor)
  .patch(
    authDoctor.protect,
    doctorController.uploadUserImages,
    doctorController.resizeUserImages,
    doctorController.updateOneDoctor
  )
  .delete(doctorController.deleteOneDoctor);

router.patch("/updateMyPassword/:id", authDoctor.updatePassword);
router.patch("/updateMyPasswordNormal", authDoctor.updatePassword);

module.exports = router;
