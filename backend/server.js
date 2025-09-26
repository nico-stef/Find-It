import express from "express";
import cors from "cors";
import connectDB from "./connections/mongoDb.js";
import cookieParser from "cookie-parser";
import { errorHandler } from "./middlewares/errorHandler.js";
import UserRoutes from "./routes/user.routes.js";
import LocationRoutes from './routes/location.routes.js';
import PostRoutes from './routes/post.routes.js';

const app = express(); //express application instance = serverul web 
app.use(express.json()); //middleware ce primeste req body in formt JSON si il transforma in obiect JS

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true   // permite cookies
}));

app.use(cookieParser());

//------conectare la MongoDb----------
connectDB();

app.use(UserRoutes);
app.use(LocationRoutes);
app.use(PostRoutes);

app.use(errorHandler);

app.listen(3000, () => {
    console.log("Server running on port 3000");
});