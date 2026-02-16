const userModel = require("../models/user.models");
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt");
const foodpartnerModel = require("../models/foodpartner.model");

async function registerUser(req,res){ 
    const {fullName,email,password} = req.body;
    const isUserAlreadyExist = await userModel.findOne({email});
    if(isUserAlreadyExist){
        return res.status(400).json({
            message:"user already exist"
        })
    }
    const hashedPassword = await bcrypt.hash(password,10);

    const user = await userModel.create({
        fullName,
        email,
        password:hashedPassword,
    });

    const token = jwt.sign({
        id:user._id,
    },process.env.JWT_SECRET);
    res.cookie("token",token);
    res.status(201).json({
        message:"User registered successfully",
        user:{
            _id:user._id,
            email:user.email,
            fullName:user.fullName,
        }
    });
};

async function loginUser(req,res){
    const {email,password} = req.body;

    const user = await userModel.findOne({email});
    if(!user){
        return res.status(400).json({
            message:"Invalid email or password",
        })
    }

    const isPasswordValid = await bcrypt.compare(password,user.password);
    if(!isPasswordValid){
        return res.status(400).json({
            message:"Invalid email or password",
        })
    };
    
    const token = jwt.sign({
        id:user._id,
    },process.env.JWT_SECRET);

    res.cookie("token",token);

    res.status(200).json({
        message:"User Logged In Successfully",
        user:{
            _id:user._id,
            email:user.email,
            fullName:user.fullName
        }
    })
}

function logoutUser(req,res){
    res.clearCookie("token");
    res.status(200).json({
        message:"User LoggedOut Successfully",
    })
}

async function registerFoodPartner(req,res){
    const {businessName,firstName,lastName,phone,address,email,password} = req.body;

    const isAccountAlreadyExists = await foodpartnerModel.findOne({email});

    if(isAccountAlreadyExists){
        return res.status(400).json({
            message:"Food partner account already exists"
        })
    };

    const hashedPassword = await bcrypt.hash(password,10);

    const foodPartner = await foodpartnerModel.create({
        businessName,
        email,
        password:hashedPassword,
        firstName,
        lastName,
        phone,
        address,
    });

    const token = jwt.sign({
        id:foodPartner._id,
    },process.env.JWT_SECRET);

    res.cookie("token",token);

    res.status(201).json({
        message:"Food Partner registered successfully",
        foodPartner:{
            _id:foodPartner._id,
            email:foodPartner.email,
            businessName:foodPartner.businessName,
            phone:foodPartner.phone,
            address:foodPartner.address,
            firstName:foodPartner.firstName,
            lastName:foodPartner.lastName,
        }
    })
}

async function loginFoodPartner(req,res){
    console.log(req.body)
    const {email,password} = req.body;

    const foodPartner = await foodpartnerModel.findOne({email});
    console.log(foodPartner);
    if(!foodPartner){
        return res.status(400).json({
            message:"Invalid email or password",
        })
    };
    
    const isPasswordValid = await bcrypt.compare(password,foodPartner.password);
    if(!isPasswordValid){
        return res.status(400).json({
            message:"Invalid email or password",
        })
    };

    const token = jwt.sign({
        id:foodPartner._id,
    },process.env.JWT_SECRET);

    res.cookie("token",token);
    res.status(200).json({
        message:"Food Partner logged in successfully",
        foodPartner:{
            _id:foodPartner._id,
            email:foodPartner.email,
            name:foodPartner.name,
        }
    })
}

function logoutFoodPartner(req,res){
    res.clearCookie("token");  
    return res.status(200).json({
        message:"Food Partner logged out successfully"
    })
}

module.exports = {
    registerUser,
    loginUser,
    logoutUser,
    registerFoodPartner,
    loginFoodPartner,
    logoutFoodPartner,
}