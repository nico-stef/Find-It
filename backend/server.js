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

const allowedOrigins = [
    "http://localhost:5173",
    "https://find-it-self.vercel.app"
]

//cors nu poate primi un array deci folosim aceasta functia care verifica daca origin se afla in array
app.use(cors({
    origin: function (origin, callback) {
        // permit requests fara header Origin (ex: curl, postman)
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);  //request permis, asa e sintaxa functiei de calbback de la cors
        } else {
            callback(new Error('Not allowed by CORS')); // request blocat
        }
    },
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization'] //specifica ce headere poate trimite browser-ul in request-uri non-simple (ex: Content-Type: application/json, Authorization)
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