const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const fileUpload = require("express-fileupload");
const cors = require("cors");

if(process.env.NODE_ENV !== "production"){
    require("dotenv").config({path: "backend/config/config.env"});
}

app.set('trust proxy', 1);


app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true,
}));

// Using middleware
app.use(express.json({ limit: "50mb"}));
app.use(express.urlencoded({ limit: "50mb", extended: true }));   
app.use(cookieParser()); 
app.use(fileUpload({
    limits: { fileSize: 50 * 1024 * 1024},
    useTempFiles: true,
    tempFileDir: "/tmp"
}));

// Importing routes
const post = require("./routes/post");
const user = require("./routes/user");

// Using Routes
app.use("/api/v1", post);
app.use("/api/v1", user);

module.exports = app;