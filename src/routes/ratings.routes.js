import Router from "express-promise-router";
import { createRating } from "../controllers/ratings.controller.js";
import { isAuth } from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/ratings", isAuth, createRating);

export default router;
