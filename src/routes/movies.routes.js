import Router from "express-promise-router";
import {
  getAllMovies,
  getMovieById,
  searchMovie,
} from "../controllers/movies.controller.js";
import { isAuth } from "../middlewares/auth.middleware.js";

const router = Router();

router.get("/movies", isAuth, getAllMovies);

router.get("/movies/search", isAuth, searchMovie);

router.get("/movies/:id", isAuth, getMovieById);

export default router;
