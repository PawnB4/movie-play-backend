import { verifyAuth } from "../libs/jwt.js";

export const isAuth = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res
      .status(401)
      .json({ message: "Token missing", code: "TOKEN_MISSING" });
  }

  try {
    const verifiedToken = await verifyAuth(token);
    req.userId = verifiedToken.id;
    next();
  } catch (err) {
    return res
      .status(401)
      .json({ message: "Token invalid or expired", code: "TOKEN_INVALID" });
  }
};
