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
    },
    async finOneById(id) {
        const post = await Post.findById(id);
        if (!post) return null;

        await post.populate("comments.userId", "firstName lastName email");
        return post;
    },
    async addComment(postId, userId, text) {
        const post = await this.finOneById(postId);
        if (!post) return null;

        post.comments.push({ userId, text });//modifici documentul mongoose in RAM, nu in DB
        await post.save(); //salvezi modificarile in DB

        await post.populate("comments.userId", "firstName lastName email");// adauga campurile name si email in comments la userId in 
        //                                                                //documentul mongoose de aici. baza de date ramane neschimbata

        return post.comments;//returneaza comentariile acelei postari
    },
    async findComment(postId, commentId) {
        const post = await Post.findById(postId);
        if (!post) return null;

        const comment = post.comments.id(commentId); //metoda id este doar pentru array-urile de subdocumente
        return comment;
    },
    async deleteComment(postId, commentId) {
        const post = await Post.findById(postId);
        if (!post) return null;

        const comment = post.comments.id(commentId); //metoda id este doar pentru array-urile de subdocumente

        // Ștergem subdocumentul
        comment.deleteOne(); // în loc de comment.remove()

        await post.save();
        await post.populate("comments.userId", "firstName lastName email");

        return post.comments;
    },
    async markAsResolved(postId) {
        await Post.findByIdAndUpdate(postId, { type: "resolved" });
    },
    async deletePost(postId) {
        await Post.findByIdAndDelete(postId);
    }
};

export default PostRepository;