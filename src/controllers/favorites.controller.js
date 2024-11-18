import { pool } from "../db.js";

export const getUserFavoriteMovies = async (req, res) => {
  const query = `
    SELECT m.id,
       m.title,
       m.genre,
       m.runtime,
       m.release_date,
       m.images ->> 'poster_url' AS poster_url,
       COALESCE(AVG(r.rating), 0) AS average_rating,
       COALESCE(COUNT(r), 0) AS vote_count
FROM Movie m
JOIN Favorites f ON m.id = f.movie_id AND f.user_id = ${req.userId}
LEFT JOIN Ratings r ON m.id = r.movie_id
GROUP BY m.id, m.title, m.genre, m.runtime, m.release_date
ORDER BY m.release_date DESC
    `;

  const result = await pool.query(query);
  res.json(result.rows);
};


export const addFavoriteMovie = async (req, res) => {
  const { movieId } = req.body;
  if (!movieId) {
    return res.status(400).json({ message: "movieId is required" });
  }

  await pool.query(
    `INSERT INTO favorites (user_id, movie_id) VALUES ($1, $2)`,
    [req.userId, movieId]
  );
  res.json({ message: "Favorite added successfully" });
};

export const removeFavoriteMovie = async (req, res) => {
  const { movieId } = req.body;
  if (!movieId) {
    return res.status(400).json({ message: "movieId is required" });
  }
  await pool.query(
    `DELETE FROM favorites WHERE user_id = $1 AND movie_id = $2`,
    [req.userId, movieId]
  );
  res.json({ message: "Favorite deleted successfully" });
};
