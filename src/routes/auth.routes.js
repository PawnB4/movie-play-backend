import Router from "express-promise-router";
import {
  login,
  // updateUserProfilePicture,
  updateUserNickname,
  refreshAccessToken,
  removeUser,
  getUserInfo
} from "../controllers/auth.controller.js";
import { isAuth } from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/login", login);

router.post("/refresh-token", refreshAccessToken);

router.get("/user", isAuth, getUserInfo);

router.patch("/user", isAuth, updateUserNickname);

router.delete("/user", isAuth, removeUser);

export default router;
