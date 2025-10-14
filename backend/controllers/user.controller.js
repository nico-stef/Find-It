import userService from "../services/user.service.js";

const UserController = {
    register: async (req, res, next) => {
        try {
            const { email, password, firstName, lastName } = req.body;
            if (!email || !password || !firstName || !lastName) {
                return res.status(400).json({ message: "Câmpurile necesare nu pot fi goale." });
            }
            await userService.register(req.body);
            res.status(201).json({ message: "Account created successfully" });
        } catch (error) {
            next(error);
        }
    },
    login: async (req, res, next) => {
        try {
            const { email, password } = req.body;
            if (!email || !password) {
                return res.status(400).json({ message: "Email or password missing" });
            }

            const token = await userService.login(req.body); //tokenul JWT

            res.cookie("token", token, {
                httpOnly: true,
                secure: true,       // true in productie cu HTTPS
                sameSite: "none",   // cand cererile vin de pe alt domeniu
                maxAge: 24 * 60 * 60 * 1000 // 1 zi
            });

            res.status(200).json({ message: "Login successful" });
        } catch (error) {
            next(error);
        }
    },
    logout: async (req, res, next) => {
        try {
            //daca nu exista cookie
            if (!req.cookies.token) {
                return res.status(200).json({ message: "No active session" });
            }

            // res.clearCookie("token", {
            //     httpOnly: true,
            //     sameSite: "lax",
            //     secure: false
            // });

            //production
            res.clearCookie("token", {
                httpOnly: true,
                secure: true,       // trebuie să fie la fel ca la setare
                sameSite: "none"    // pentru cross-site requests
            });
            res.status(200).json({ message: "Logged out successfully." });

        } catch (error) {
            next(error);
        }
    },
    checkIfAuth: async (req, res) => { //functie care verifica daca user e autentificat. cand e apelat acest endpoint,
        // se trece prin middleware-ul authMiddleware, care verifica tokenul din cookie.
        // functia ajuta la a sti daca user are accces la anumite pagini din frontend
        res.status(200).json({ authenticated: true });
    },
    getUserInfo: async (req, res, next) => { //own profile
        try {
            const email = req.user.email;
            const data = await userService.userInfo(email);

            res.status(200).json(data);
        } catch (err) {
            next(err);
        }
    },
    getOtherUserInfo: async (req, res, next) => { // other users' profile
        try {
            const { email } = req.query;
            const data = await userService.userInfo(email);

            res.status(200).json(data);
        } catch (err) {
            next(err);
        }
    },
    updateUserInfo: async (req, res, next) => {
        try {
            const userId = req.user.userId;
            const userData = req.body;
            if (!userData.firstName || !userData.lastName || !userData.email) {
                return res.status(400).json({ message: "Câmpurile necesare nu pot fi goale." });
            }

            const newUser = await userService.updateById(userId, userData, req.file);
            res.status(200).json(newUser);
        } catch (err) {
            next(err);
        }
    },
    deleteUser: async (req, res, next) => {
        try {
            const userId = req.user.userId;
            await userService.deleteUser(userId);

            res.clearCookie("token");
            res.status(204).send();
        } catch (err) {
            next(err);
        }
    },
    getUserId: async (req, res, next) => {
        try {
            const userId = req.user.userId;
            res.status(200).json({ userId });
        } catch (err) {
            next(err);
        }
    }
};

export default UserController;