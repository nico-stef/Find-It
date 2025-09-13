import User from "../models/User.js";

const UserRepository = {
    async findByEmail(email) {
        return User.findOne({ email });
    },

    async create(userData) {
        const user = new User(userData);
        return user.save();
    }
};

export default UserRepository;