import User from "../models/User.js";

const UserRepository = {
    async findByEmail(email) {
        return User.findOne({ email });
    },

    async create(userData) {
        const user = new User(userData);
        return user.save();
    },

    async updateById(userId, userData) {
        return User.findByIdAndUpdate(userId, userData, {
            new: true,          // returneaza documentul actualizat
            runValidators: true // aplică validarile definite în schema
        });
    },
    async deleteById(userId) {
        return User.findByIdAndDelete(userId); //user-ul sters sau null daca nu e gasit
    }
};

export default UserRepository;