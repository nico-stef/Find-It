import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config();

const autocomplete = async (req, res) => {
    const input = req.query.input;

    if (!input) return res.status(400).json({ error: "Query is required" });

    try {
        const apiKey = process.env.GOOGLE_API_KEY;
        const url = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(input)}&key=${apiKey}&language=ro`;

        const response = await fetch(url);
        const data = await response.json();

        const suggestions = data.predictions.map(p => ({
            description: p.description,
            place_id: p.place_id,
        }));

        res.status(200).json(suggestions);
    } catch (error) {
        next(error);
    }
}

export default autocomplete;