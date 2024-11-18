import express from "express";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.routes.js";
import ratingsRoutes from "./routes/ratings.routes.js";
import moviesRoutes from "./routes/movies.routes.js";
import favoriteRoutes from "./routes/favorites.routes.js";
import uploadsRoutes from "./routes/uploads.routes.js";
import { pool } from "./db.js";

const app = express();

// Middlewares
app.use(morgan("dev"));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//Routes
app.get("/", (req, res) => res.json({ message: "Welcome to my API" }));
app.get("/api/ping", async (req, res) => {
  const pingResponse = await pool.query("SELECT NOW()");
  return res.json(pingResponse.rows[0]);
});
app.use("/api/auth", authRoutes);
app.use("/api", ratingsRoutes);
app.use("/api", moviesRoutes);
app.use("/api", favoriteRoutes);
app.use("/api", uploadsRoutes);

// Error handling
app.use((err, req, res, next) => {
  console.log(err);
  console.log(err.message);
  res.status(500).json({
    status: "error",
    message: err.message,
  });
});

export default app;
