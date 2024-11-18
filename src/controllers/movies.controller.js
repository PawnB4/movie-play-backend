import { pool } from "../db.js";

export const getAllMovies = async (req, res, next) => {
  const { genre, limit, offset } = req.query;

  let query = `
    SELECT m.id, m.title, m.genre, m.runtime, m.release_date, 
           m.images->>'poster_url' as poster_url, 
           COALESCE(AVG(r.rating), 0) AS average_rating, 
           COALESCE(COUNT(r), 0) AS vote_count 
    FROM Movie m 
    LEFT JOIN Ratings r ON m.id = r.movie_id 
  `;

  const values = [];
  if (genre) {
    query += `WHERE m.genre = $1 `;
    values.push(genre);
  }

  query += `
    GROUP BY m.id, m.title, m.genre, m.runtime, m.release_date 
    ORDER BY m.release_date DESC 
    LIMIT $${values.length + 1} OFFSET $${values.length + 2}
  `;

  values.push(limit, offset);

  const result = await pool.query(query, values);
  res.json(result.rows);
};

export const getMovieById = async (req, res, next) => {
  const result = await pool.query(
    "SELECT m.*, COALESCE(ratings_data.average_rating, 0) AS average_rating, COALESCE(ratings_data.vote_count, 0) AS vote_count, json_agg(DISTINCT jsonb_build_object('id', c.id, 'name', c.name, 'role', mc.role, 'department', mc.department, 'profile_path', c.profile_path)) AS crew, json_agg(DISTINCT jsonb_build_object('id', a.id, 'name', a.name, 'character_name', ma.character_name, 'profile_path', a.profile_path)) AS actors FROM Movie m LEFT JOIN (SELECT movie_id, AVG(rating) AS average_rating, COUNT(*) AS vote_count FROM Ratings GROUP BY movie_id) AS ratings_data ON m.id = ratings_data.movie_id LEFT JOIN MovieCrew mc ON m.id = mc.movie_id LEFT JOIN Crew c ON mc.crew_id = c.id LEFT JOIN MovieActors ma ON m.id = ma.movie_id LEFT JOIN Actors a ON ma.actor_id = a.id WHERE m.id = $1 GROUP BY m.id, ratings_data.average_rating, ratings_data.vote_count",
    [req.params.id]
  );
  res.json(result.rows[0]);
};

export const searchMovie = async (req, res, next) => {
  const { searchString, sortBy = 'release_date', order = 'DESC', limit = 10, offset = 0 } = req.query;

  console.log(`Received parameters: sortBy=${sortBy}, order=${order}`);

  if (!searchString) {
    return res.status(400).json({ message: "Query parameter is required" });
  }

  const validSortBy = ['release_date', 'average_rating'];
  const validOrder = ['ASC', 'DESC'];

  if (!validSortBy.includes(sortBy) || !validOrder.includes(order)) {
    return res.status(400).json({ message: "Invalid sortBy or order parameter" });
  }

  const searchPattern = `%${searchString}%`;

  let query = `
    SELECT DISTINCT mo.*
    FROM (
      SELECT m.id,
             m.title,
             m.genre,
             m.runtime,
             m.release_date,
             m.images ->> 'poster_url' AS poster_url,
             COALESCE(AVG(r.rating), 0) AS average_rating,
             COALESCE(COUNT(r), 0) AS vote_count
      FROM Movie m
      LEFT JOIN Ratings r ON m.id = r.movie_id
      GROUP BY m.id
    ) mo
    LEFT JOIN MovieActors ma ON mo.id = ma.movie_id
    LEFT JOIN Actors ac ON ma.actor_id = ac.id
    WHERE LOWER(mo.title) LIKE LOWER($1)
      OR LOWER(ac.name) LIKE LOWER($1)
    ORDER BY ${sortBy} ${order}
    LIMIT $2 OFFSET $3
  `;

  console.log(`Executing query: ${query}`);
  
  const result = await pool.query(query, [searchPattern, limit, offset]);
  
  res.json(result.rows);
};

