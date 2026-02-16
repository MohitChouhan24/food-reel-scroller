const express = require("express");
const authController = require("../controllers/auth.controllers")

const router = express.Router();

//User Auth APIs
router.post("/user/register",authController.registerUser);
router.post("/user/login",authController.loginUser);
router.get("/user/logout",authController.logoutUser);

//Food Partner Auth APIs
router.post("/food-partner/register",authController.registerFoodPartner);
router.post("/food-partner/login",authController.loginFoodPartner);
router.get("/food-partner/logout",authController.logoutFoodPartner);

module.exports = router;