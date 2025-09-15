import userService from "../services/user.service.js";

const UserController = {
    register: async (req, res, next) => {
        try {
            const { email, password, firstName, lastName } = req.body;
            if (!email || !password || !firstName || !lastName) {
                return res.status(400).json({ message: "All fields need to be completed." });
            }
            console.log(req.body)
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
                secure: false,       // true in productie cu HTTPS
                sameSite: "lax",
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

            res.clearCookie("token", {
                httpOnly: true,
                sameSite: "lax",
                secure: false
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
    }
};

export default UserController;