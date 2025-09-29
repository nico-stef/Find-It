import PostService from "../services/post.service.js";

const PostController = {
    post: async (req, res, next) => {
        try {
            const { type, title, contact, place_id } = req.body;
            if (!place_id || !title || !contact || !type) {
                return res.status(400).json({ message: "Campurile necesare nu sunt completate." });
            }

            const userId = req.user.userId;

            await PostService.createPost(req.body, req.files, userId);
            res.status(201).json({ message: "Post created successfully!" });
        } catch (err) {
            next(err);
        }
    },
    getByUser: async (req, res, next) => {
        try {
            const userId = req.user.userId;
            const page = parseInt(req.query.page);
            const limit = parseInt(req.query.limit);

            const result = await PostService.getPostsUser(userId, page, limit);
            res.status(200).json(result);
        } catch (err) {
            next(err);
        }
    }
};

export default PostController;