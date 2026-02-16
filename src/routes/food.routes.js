const express = require("express");
const multer = require("multer");
const authMiddleware = require("../middlewares/auth.middleware");
const foodController = require("../controllers/food.controller");
const router = express.Router();

const upload = multer({
    storage:multer.memoryStorage(),
});

router.post("/",authMiddleware.authFoodPartnerMiddleware,upload.single("video"),foodController.createFood);

router.get("/",authMiddleware.authUserMiddleware,foodController.getFoodItems); 

router.post("/like",authMiddleware.authUserMiddleware,foodController.likeFood);

router.post("/save",authMiddleware.authUserMiddleware,foodController.saveFood);

router.get("/save",authMiddleware.authUserMiddleware,foodController.getSavedFoodItems);
module.exports = router;