require("dotenv").config();
const cookieParser = require("cookie-parser");
const express = require("express");
const authRoutes = require("./routes/auth.route");
const foodRoutes = require("./routes/food.routes");
const foodPartnerRoutes = require("./routes/food-partner.routes");
const cors = require("cors");

const app = express();

app.use(cors({
    origin:["http://localhost:5173",
    "https://food-view-frontend.vercel.app"
    ],
    methods:["GET","POST","PUT","DELETE"],
    credentials:true,
}));
app.use(express.json());
app.use(cookieParser());

app.get("/",(req,res)=>{
    res.send("hello world"); 
})
app.use("/api/auth",authRoutes);
app.use("/api/food",foodRoutes);
app.use("/api/food-partner",foodPartnerRoutes);

module.exports = app;