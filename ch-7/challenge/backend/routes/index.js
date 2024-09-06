var express = require("express");
var router = express.Router();
const USER_CONTROLLER = require("../controllers/user.controller");

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Express" });
});
router.post("/register", USER_CONTROLLER.createUser);
router.post("/login", USER_CONTROLLER.authLogin);
router.post("/verify-otp", USER_CONTROLLER.verifyOTP);
router.post("/forgot-password", USER_CONTROLLER.forgetPass);
router.post("/reset-password", USER_CONTROLLER.resetPass);

module.exports = router;
