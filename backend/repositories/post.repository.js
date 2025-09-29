import Post from "../models/Post.js";

const PostRepository = {
    async create(postData) {
        const post = new Post(postData);
        return post.save();
    },
    async findByUser(userId, page, limit) {
        const posts = await Post.find({ userId })
            .skip((page - 1) * limit) // Skip documents for previous pages
            .limit(limit); // Limit the number of documents

        const totalPosts = await Post.countDocuments({ userId });

        return {
            totalPages: Math.ceil(totalPosts / limit),
            posts
        };
    },
    async deleteByUser(userId) {
        return Post.deleteMany({ userId });
    }
};

export default PostRepository;