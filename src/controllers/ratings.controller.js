import { pool } from "../db.js";

export const createRating = async (req, res) => {
  const { movieId, rating } = req.body;

  if (!movieId || !rating) {
    return res.status(400).json({ message: "movieId and rating are required" });
  }

  const query = `
      INSERT INTO ratings (user_id, movie_id, rating, created_at)
      VALUES ($1, $2, $3, NOW())
      RETURNING *;
    `;

  console.log("req.user.id", req.userId);
  console.log("movieId", movieId);
  console.log("rating", rating);
  const values = [req.userId, movieId, rating]; 

  const result = await pool.query(query, values);

  res.json({ message: "Rating added successfully", rating: result.rows[0] });
};
