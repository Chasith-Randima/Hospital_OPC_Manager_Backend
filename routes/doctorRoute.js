const express = require("express");
const router = express.Router();
const authDoctor = require("../controllers/authDoctorController");
const doctorController = require("../controllers/doctorController");

router.post("/signup", authDoctor.signup);
router.post("/login", authDoctor.login);
router.get("/logout", authDoctor.logout);

router.use(authDoctor.protect);

router
  .route("/")
  .get(doctorController.getAllDoctors)
  .post(doctorController.createOneDoctor);

router
  .route("/:id")
  .get(doctorController.getOneDoctor)
  .patch(doctorController.updateOneDoctor)
  .delete(doctorController.deleteOneDoctor);

router.patch("/updateMyPassword/:id", authDoctor.updatePassword);
router.patch("/updateMyPasswordNormal", authDoctor.updatePassword);

module.exports = router;
