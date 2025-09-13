import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import { errorHandler } from "./middlewares/errorHandler.js";
import UserRoutes from "./routes/user.routes.js"

dotenv.config();

const app = express(); //express application instance = serverul web 
app.use(express.json()); //middleware ce primeste req body in formt JSON si il transforma in obiect JS

app.use(UserRoutes);

app.use(errorHandler);

const dbURI = process.env.dbURI;
mongoose.connect(dbURI)
    .then((result) => app.listen(3000))
    .catch((err) => console.log(err));