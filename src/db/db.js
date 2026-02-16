const mongoose =  require("mongoose");

function connectDB(){
    mongoose.connect(process.env.MONGO_URI)
        .then(()=>{
            console.log("MongoDB conncected");
        })
        .catch((err)=>{
            console.log("MongoDB connection error");
            console.log(err.message);
        })
}

module.exports = connectDB;
