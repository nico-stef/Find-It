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
    },
    async findByFilters(type, startDate, endDate, location, page, limit) {
        const query = {};
        if (type) query.type = type;
        if (location) query["location.address"] = location;
        if (startDate && endDate) query.dateTime = { $gte: startDate, $lte: endDate };

        const totalPosts = await Post.countDocuments(query);

        const posts = await Post.find(query)
            .sort({ dateTime: -1 })
            .skip((page - 1) * limit)
            .limit(limit);

        return {
            totalPages: Math.ceil(totalPosts / limit),
            posts
        };
    }
};

export default PostRepository;