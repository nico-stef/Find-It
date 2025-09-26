import PostService from "../services/post.service.js";

const PostController = {
    post: async (req, res, next) => {
        try {
            const { type, title, contact, place_id } = req.body;
            if (!place_id || !title || !contact || !type) {
                return res.status(400).json({ message: "Campurile necesare nu sunt completate." });
            }

            await PostService.createPost(req.body, req.files);
            res.status(201).json({ message: "Post created successfully!" });
        } catch (err) {
            next(err);
        }
    }
};

export default PostController;