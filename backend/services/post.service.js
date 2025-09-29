import postRepository from '../repositories/post.repository.js';
import { createPublicError } from "../utils/errors.js";
import getCoordsFromPlaceId from "../utils/getCoordsFromPlaceId.js";
import uploadFilesToS3 from "../utils/uploadFilesToS3.js";
import generateSignedUrls from "../utils/generateSignedURLs.js";

const PostService = {
    createPost: async (postData, files, userId) => {

        // 1. Luam coordonatele de la Google
        const { lat, lng, address } = await getCoordsFromPlaceId(postData.place_id);
        postData.location = {
            address,
            coords: { type: "Point", coordinates: [lng, lat] }
        };

        //Salvam si userId
        postData.userId = userId;

        // 2. Incarcam imaginile, daca exista, in S3 si preluam URL-urile
        if (files && files.length > 0) {
            postData.images = await uploadFilesToS3(files);
        }

        // 3. Creeaza post în DB
        await postRepository.create(postData);
    },
    getPostsUser: async (userId, page, limit) => {
        const result = await postRepository.findByUser(userId, page, limit);
        const posts = result.posts;
        const totalPages = result.totalPages;

        for (const post of posts) {
            post.images = await generateSignedUrls(post.images);//images(care sunt keys) vor fi transformate in presigned URLs
        }

        return { posts, totalPages };
    }

};

export default PostService;