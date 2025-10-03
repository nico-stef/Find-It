import postRepository from '../repositories/post.repository.js';
import { createPublicError } from "../utils/errors.js";
import getCoordsFromPlaceId from "../utils/getCoordsFromPlaceId.js";
import uploadFilesToS3 from "../utils/uploadFilesToS3.js";
import generateSignedUrls from "../utils/generateSignedURLs.js";

// data in mongo este salvata in format UTC, iar de pe frontend, pentru comparare, vine data locala
function getDateRangeForDay(dateString) {
    const date = new Date(dateString); // va fi 2025-10-15T00:00:00 în local time

    const startDate = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0, 0);
    const endDate = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59, 999);

    return { startDate, endDate };
}

//numele locatiei vine de pe frontend cu diacritice si le inlocuim
function normalizeLocation(str) {
    if (!str) return str;
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

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
    },
    getPostsFiltered: async (type, date, location, page, limit) => {

        let startDate = null, endDate = null;
        if (date) {
            const dateRange = getDateRangeForDay(date);
            startDate = dateRange.startDate;
            endDate = dateRange.endDate;
        }

        const normalizedLocation = normalizeLocation(location);

        const result = await postRepository.findByFilters(type, startDate, endDate, normalizedLocation, page, limit);
        const posts = result.posts;
        const totalPages = result.totalPages;

        for (const post of posts) {
            post.images = await generateSignedUrls(post.images);//images(care sunt keys) vor fi transformate in presigned URLs
        }

        return { posts, totalPages };
    }

};

export default PostService;