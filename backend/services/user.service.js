import userRepository from "../repositories/user.repository.js";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { createPublicError } from "../utils/errors.js";
import uploadFilesToS3 from "../utils/uploadFilesToS3.js";
import generateSignedUrls from "../utils/generateSignedURLs.js";
import PostRepository from "../repositories/post.repository.js";

dotenv.config();

const UserService = {
    async register(userData) {
        const { email } = userData;

        // verifica daca emailul exista deja
        const existingUser = await userRepository.findByEmail(email);
        if (existingUser) {
            throw createPublicError("Email-ul este deja folosit de alt cont.", 409);
        }

        const user = await userRepository.create(userData);
        return user;
    },
    async login(userData) {
        const { email, password } = userData;

        const existingUser = await userRepository.findByEmail(email);
        //daca nu exista userul sau parola nu corespunde
        if (!existingUser || !(await bcrypt.compare(password, existingUser.password))) {
            throw createPublicError("Credentiale invalide.", 401);
        }

        const token = jwt.sign(
            {
                email: existingUser.email,
                userId: existingUser._id.toString()
            },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );

        return token;
    },
    async userInfo(email) {
        const user = await userRepository.findByEmail(email);

        if (!user)
            throw createPublicError("User-ul nu exista.", 404);

        const urls = await generateSignedUrls(user.profileImage); //returneaza un array de presigned urls
        user.avatar = urls[0]; // prima valoare din array (si singura)

        return {
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            phone: user.phone,
            city: user.city,
            avatar: user.avatar
        };
    },
    async updateById(userId, userData, file) {
        try {
            if (file) {
                const uploadedFiles = await uploadFilesToS3(file); //returneaza un array
                userData.profileImage = uploadedFiles[0]; // doar primul fisier
            }

            const newUser = await userRepository.updateById(userId, userData);

            if (!newUser)
                throw createPublicError("User-ul nu exista.", 404);

            const urls = await generateSignedUrls(newUser.profileImage); //returneaza un array de presigned urls
            newUser.avatar = urls[0]; // prima valoare din array (si singura)

            return {
                firstName: newUser.firstName,
                lastName: newUser.lastName,
                email: newUser.email,
                phone: newUser.phone,
                city: newUser.city,
                avatar: newUser.avatar
            };
        } catch (err) {
            if (err.code === 11000 && err.keyPattern?.email) { //eroare de la mongoose cum ca emailul exista deja; e setat unique in Models
                throw createPublicError("Email-ul este folosit de alt cont.", 409);
            }
            console.log(err);
        }
    },
    async deleteUser(userId) {
        const result = await userRepository.deleteById(userId);
        if (!result)
            throw createPublicError("User-ul nu a fost gasit pentru a fi sters", 404);

        await PostRepository.deleteByUser(userId);

        return true;
    }
}

export default UserService;