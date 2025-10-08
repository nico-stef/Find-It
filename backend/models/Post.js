import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
    type: { type: String, enum: ["lost", "found", "resolved"], required: true },
    title: { type: String, required: true, trim: true },
    location: { //e un obiect singular, spre deosebire de comments care e array de obiecte
        address: { type: String, required: true }, //denumirea locatiei in cuvinte
        coords: {                                  //coordonatele locatiei
            type: {
                type: String,
                enum: ['Point'], //Point = tip de obiect GeoJSON = [longitude, latitude]
            },
            coordinates: {
                type: [Number], // coordonates e un array de numere
                required: true
            }
        }
    },
    dateTime: { type: Date },
    contact: { type: String, required: true },
    description: { type: String, trim: true },
    images: { type: [String], default: [] }, //aici salvam keys ale obiectelor din bucket S3
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    comments: [ //array de obiecte
        {
            userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
            text: { type: String, required: true, trim: true },
            createdAt: { type: Date, default: Date.now }
        }
    ]
}, { timestamps: true });

const Post = mongoose.model("Post", postSchema);
export default Post;