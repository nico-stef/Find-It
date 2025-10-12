import PostService from "../services/post.service.js";

const PostController = {
    post: async (req, res, next) => {
        try {
            const { type, title, contact, place_id, location } = req.body;
            if (!place_id || !title || !contact || !type) {
                return res.status(400).json({ message: "Campurile necesare nu sunt completate." });
            }

            const userId = req.user.userId;

            await PostService.createPost(req.body, req.files, userId, location);
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
    },
    getByFilters: async (req, res, next) => {
        try {
            const { type, date, location } = req.query;
            const page = parseInt(req.query.page);
            const limit = parseInt(req.query.limit);

            const result = await PostService.getPostsFiltered(type, date, location, page, limit);
            res.status(200).json(result);
        } catch (err) {
            next(err);
        }
    },
    getPost: async (req, res, next) => {
        try {
            const { id } = req.params;
            const userId = req.user.userId;

            if (!id) {
                return res.status(400).json({ message: "ID-ul postării lipsește." });
            }

            const result = await PostService.getPostDetails(id, userId);

            if (!result.post) return res.status(404).json({ message: "Postare negăsită" });

            res.status(200).json(result);
        } catch (err) {
            next(err);
        }
    },
    postComment: async (req, res, next) => {
        try {
            const { id } = req.params;
            const { text } = req.body;
            const userId = req.user.userId;
            const comments = await PostService.addComment(id, userId, text);

            res.status(201).json({ message: "Comentariu adăugat!", comments });
        } catch (err) {
            next(err);
        }
    },
    deleteComment: async (req, res, next) => {
        try {
            const { postId, commentId } = req.params;
            const userId = req.user.userId;
            const updatedComments = await PostService.deleteComment(postId, commentId, userId);

            res.status(200).json({ message: "Comentariu șters!", updatedComments });
        } catch (err) {
            next(err);
        }
    },
    updateAsResolved: async (req, res, next) => {
        try {
            const { postId } = req.params;
            const userId = req.user.userId;

            await PostService.markPostAsResolved(postId, userId);

            res.status(200).json({ message: "Postarea a fost marcată ca rezolvată" });
        } catch (err) {
            next(err);
        }
    },
    deletePost: async (req, res, next) => {
        try {
            const { postId } = req.params;
            const userId = req.user.userId;

            await PostService.deletePost(postId, userId);

            res.status(204).json({ message: "Postarea a fost stearsa." });
        } catch (err) {
            next(err);
        }
    }
};

export default PostController;