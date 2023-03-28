const express = require("express");
const router = express.Router();

const authController = require("../controllers/authController");
const userController = require("../controllers/userController");

router.post("/signup", authController.signup);
router.post("/login", authController.login);
router.get("/logout", authController.logout);

router.use(authController.protect);
router
  .route("/")
  .get(userController.getAllUser)
  .post(userController.createOneUser);

router
  .route("/:id")
  .get(userController.getOneUser)
  .patch(userController.updateOneUser)
  .delete(userController.deleteOneUser);

router.patch("/updateMyPassword/:id", authController.updatePassword);
router.patch("/updateMyPasswordNormal", authController.updatePassword);

module.exports = router;
