import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
    type: { type: String, enum: ["lost", "found"], required: true },
    title: { type: String, required: true, trim: true },
    location: {
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
    images: { type: [String], default: [] }
}, { timestamps: true });

const Post = mongoose.model("Post", postSchema);
export default Post;