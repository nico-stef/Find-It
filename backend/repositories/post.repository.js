import Post from "../models/Post.js";

const PostRepository = {
    async create(postData) {
        const post = new Post(postData);
        return post.save();
    }
};

export default PostRepository;