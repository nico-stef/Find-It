import dotenv from "dotenv";
import { createPublicError } from "../utils/errors.js";
dotenv.config();

const getCoordsFromPlaceId = async (placeId) => {
    if (!placeId) {
        throw createPublicError("place_id nu exista.", 400);
    }

    try {
        const apiKey = process.env.GOOGLE_API_KEY;
        const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${encodeURIComponent(placeId)}&fields=name,formatted_address,geometry&key=${apiKey}`;

        const response = await fetch(url);

        const data = await response.json();

        const lat = data.result.geometry.location.lat;
        const lng = data.result.geometry.location.lng;
        const address = data.result.formatted_address;

        console.log(address)

        return { lat, lng, address };
    } catch (err) {
        console.log(err);
        throw createPublicError("Eroare internă.", 400);
    }
};

export default getCoordsFromPlaceId;