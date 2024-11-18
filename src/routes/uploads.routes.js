import multer from "multer";
import Router from "express-promise-router";
import { createUpload } from "../controllers/uploads.controller.js";
import { isAuth } from "../middlewares/auth.middleware.js";

const upload = multer({ storage: multer.memoryStorage() });
const router = Router();

router.post("/profile-image", isAuth, upload.single("file"), createUpload);

export default router;
