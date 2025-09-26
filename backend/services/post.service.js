import postRepository from '../repositories/post.repository.js';
import { createPublicError } from "../utils/errors.js";
import getCoordsFromPlaceId from "../utils/getCoordsFromPlaceId.js";
import uploadFilesToS3 from "../utils/uploadFilesToS3.js";

const PostService = {
    createPost: async (postData, files) => {

        // 1. Luam coordonatele de la Google
        const { lat, lng, address } = await getCoordsFromPlaceId(postData.place_id);
        postData.location = {
            address,
            coords: { type: "Point", coordinates: [lng, lat] }
        };

        // 2. Incarcam imaginile, daca exista, in S3 si preluam URL-urile
        if (files && files.length > 0) {
            postData.images = await uploadFilesToS3(files);
        }

        // 3. Creeaza post în DB
        await postRepository.create(postData);
    }
};

export default PostService;