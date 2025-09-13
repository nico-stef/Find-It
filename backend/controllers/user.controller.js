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
            res.status(201).json({ message: "User created successfully" });
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

            const token = await userService.login(req.body);
            res.status(200).json({ token });
        } catch (error) {
            next(error);
        }
    }
};

export default UserController;