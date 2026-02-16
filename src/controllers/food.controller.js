const foodModel = require("../models/food.model");
const storageService = require("../services/storage.service")
const LikeModel = require("../models/likes.model");
const saveModel = require("../models/save.model");
const {v4:uuid} = require("uuid")

async function createFood(req,res){
    
    const fileUploadResult = await storageService.uploadFile(req.file.buffer,uuid());
    
    const foodItem = await foodModel.create({
        name:req.body.name,
        description:req.body.description,
        video:fileUploadResult.url,
        foodPartner:req.foodPartner._id,
    })

    res.status(201).json({
        message:"food created successfully",
        food:foodItem,
    }) 
};


async function getFoodItems(req,res){
    const foodItems = await foodModel.find({});
    const user = req.user;
    // Get all likes by the current user
    const userLikes = await LikeModel.find({ user: user?._id }).select('food');
    const likedFoodIds = userLikes.map(like => like.food.toString());

    // Get all saves by the current user
    const userSaves = await saveModel.find({ user: user?._id }).select('food');
    const savedFoodIds = userSaves.map(save => save.food.toString());

    // Add isLiked and isSaved fields to each food item
    const foodItemsWithStatus = foodItems.map(item => ({
        ...item.toObject(),
        isLiked: likedFoodIds.includes(item._id.toString()),
        isSaved: savedFoodIds.includes(item._id.toString())
    }));

    res.status(200).json({
        message:"Food Items fetched successfully",
        foodItems: foodItemsWithStatus,
    })
}

async function likeFood(req,res){
    const {foodId} = req.body;
    const user = req.user;

    const isAlreadyLiked = await LikeModel.findOne({
        user:user._id,
        food:foodId,
    })

    if(isAlreadyLiked){
        await LikeModel.deleteOne({
            user:user._id,
            food:foodId,
        })
        await foodModel.findByIdAndUpdate(foodId,{$inc:{likeCount:-1}});
        return res.status(200).json({
            message:"Food unliked successfully",
        })
    }

    const like = await LikeModel.create({
        user:user._id,
        food:foodId
    });

    await foodModel.findByIdAndUpdate(foodId,{$inc:{likeCount:1}});

    res.status(201).json({
        message:"Food liked squccessfully",
        like
    })
}

async function saveFood(req,res){
    const {foodId} = req.body;
    const user = req.user;

    const isAlreadySaved = await saveModel.findOne({
        user:user._id,
        food:foodId,
    })

    if(isAlreadySaved){
        await saveModel.deleteOne({
            user:user._id,
            food:foodId
        });

        await foodModel.findByIdAndUpdate(foodId,{$inc:{saveCount:-1}});    

        return res.status(200).json({
            message:"Food unsaved successfully",
        })
    }
    const save = await  saveModel.create({
        user:user._id,
        food:foodId,
    })

    await foodModel.findByIdAndUpdate   (foodId,{$inc:{saveCount:1}});  

    res.status(201).json({
        message:"Food saved successfully",
        save,
    })
}

async function getSavedFoodItems(req,res){
    const user = req.user;

    const savedFoods = await saveModel.find({user:user._id}).populate("food");

    if(!savedFoods || savedFoods.length === 0){
        return res.status(404).json({message:"No saved food items found"});
    }

    res.status(200).json({
        message:"Saved food items fetched successfully",
        savedFoods, 
    })
}
module.exports = {
    createFood,
    getFoodItems,
    likeFood,
    saveFood,
    getSavedFoodItems,
}