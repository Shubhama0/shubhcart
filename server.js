//const express=require("express");
import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import { connect } from "mongoose";
import connectdb from "./config/db.js";
import authroutes from "./routes/authroutes.js";
import cors from "cors";
import ProductRoutes from "./routes/ProductRoutes.js";
import CategoryRoutes from "./routes/CategoryRoutes.js";
import path from "path";
import { fileURLToPath } from "url";



//rest object
const app = express();
// configure env
dotenv.config();
//dotenv.config({path: });

// db configu
connectdb();

//es6module fix
const __filename=fileURLToPath(import.meta.url);
const __dirname=path.dirname(__filename);



//middleware
app.use(express.json());
app.use(morgan("dev"));
app.use(cors());
app.use(express.static(path.join(__dirname, "./shubhcart/build")));

//routes
app.use("/api/v1/auth", authroutes);
app.use("/api/v1/category", CategoryRoutes);
app.use("/api/v1/product", ProductRoutes);

// rest api
app.use("*", function (req, res) {
  res.sendFile(path.join(__dirname, "./shubhcart/build/index.html"));
});

// app.get("/" ,(req,res)=>{
//  res.send(" <h1>ecommerce mern stack project </h1>");
// });

//port
const PORT = process.env.PORT || 8080;

//run
app.listen(PORT, () => {
  console.log(`server running on ${PORT}`);
});
