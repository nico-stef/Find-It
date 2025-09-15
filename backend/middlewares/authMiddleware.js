import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const authMiddleware = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // atasam pe req informatiile decodate din JWT, pt urmatoarele middleware-uri/controllere
    next();
  } catch (err) {
    return res.status(401).json({ message: "Unauthorized: invalid or expired token" });
  }
};

export default authMiddleware;