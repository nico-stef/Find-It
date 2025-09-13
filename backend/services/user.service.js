import userRepository from "../repositories/user.repository.js";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { createPublicError } from "../utils/errors.js";

dotenv.config();

const UserService = {
    async register(userData) {
        const { email } = userData;

        // verifica daca emailul exista deja
        const existingUser = await userRepository.findByEmail(email);
        if (existingUser) {
            throw createPublicError("Email is already in use", 409);
        }

        const user = await userRepository.create(userData);
        return user;
    },
    async login(userData) {
        const { email, password } = userData;

        const existingUser = await userRepository.findByEmail(email);
        //daca nu exista userul sau parola nu corespunde
        if (!existingUser || !(await bcrypt.compare(password, existingUser.password))) {
            throw createPublicError("Invalid credentials.", 401);
        }

        const token = jwt.sign(
            { email: existingUser.email },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );

        return token;
    }
};

export default UserService;