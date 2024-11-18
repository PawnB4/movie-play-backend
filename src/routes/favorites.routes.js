import Router from "express-promise-router";
import {
  addFavoriteMovie,
  getUserFavoriteMovies,
  removeFavoriteMovie,
} from "../controllers/favorites.controller.js";
import { isAuth } from "../middlewares/auth.middleware.js";

const router = Router();

router.get("/favorites", isAuth, getUserFavoriteMovies);

router.post("/favorites", isAuth, addFavoriteMovie);

router.delete("/favorites", isAuth, removeFavoriteMovie);

export default router;
