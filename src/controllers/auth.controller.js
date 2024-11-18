import { pool } from "../db.js";
import {
  createAccessToken,
  createRefreshToken,
  verifyAuth,
} from "../libs/jwt.js";

const getUserByEmail = async (Email) => {
  const result = await pool.query("SELECT id FROM users WHERE email = $1", [
    Email,
  ]);
  console.log("getUserByEmail: ", result.rows[0]);
  return result.rows[0];
};

const insertNewUser = async (userInfo, googleToken) => {
  const result = await pool.query(
    `INSERT INTO users (firstname, lastname, email, profileimage, google_token) 
     VALUES ($1, $2, $3, $4, $5) 
     RETURNING id`,
    [
      userInfo.givenName,
      userInfo.familyName,
      userInfo.email,
      userInfo.photo,
      googleToken,
    ]
  );
  return result.rows[0].id;
};

const getUserRefreshToken = async (userId) => {
  const result = await pool.query(
    "SELECT refresh_token FROM users WHERE id = $1",
    [userId]
  );
  return result.rows[0]?.refresh_token || null;
};

const getUserAccessToken = async (userId) => {
  const result = await pool.query(
    "SELECT access_token FROM users WHERE id = $1",
    [userId]
  );
  return result.rows[0]?.access_token || null;
};

const updateTokensForUser = async (id, refreshToken, accessToken) => {
  await pool.query(
    "UPDATE users SET refresh_token = $1, access_token = $2 WHERE id = $3",
    [refreshToken, accessToken, id]
  );
};

export const refreshAccessToken = async (req, res) => {
  console.log("Refresh token endpoint requested");
  const { refreshToken, accessToken } = req.body;

  if (!refreshToken || !accessToken) {
    console.log("No autorizado");
    return res.status(401).json({ message: "Unauthorized" });
  }

  let verifiedToken;
  try {
    verifiedToken = await verifyAuth(refreshToken);
  } catch (error) {
    console.log(error.message);
    return res.status(401).json({ message: "Unauthorized" });
  }

  const storedRefreshToken = await getUserRefreshToken(verifiedToken.id);
  const storedAccessToken = await getUserAccessToken(verifiedToken.id);

  if (!storedRefreshToken || storedRefreshToken !== refreshToken) {
    console.log(storedRefreshToken);
    console.log(refreshToken);
    console.log("Invalid refresh token");
    return res.status(401).json({ message: "Invalid refresh token" });
  }

  if (!storedAccessToken || storedAccessToken !== accessToken) {
    console.log(storedAccessToken);
    console.log(accessToken);
    console.log("Invalid access token");
    return res.status(401).json({ message: "Invalid access token" });
  }

  const newAccessToken = await createAccessToken({ id: verifiedToken.id });
  const newRefreshToken = await createRefreshToken({ id: verifiedToken.id });

  await updateTokensForUser(verifiedToken.id, newRefreshToken, newAccessToken);

  console.log("Refreshed token successfully");
  return res.json({
    accessToken: newAccessToken,
    refreshToken: newRefreshToken,
  });
};

export const login = async (req, res) => {
  const { googleToken, userInfo } = req.body;
  if (!googleToken || !userInfo) {
    return res
      .status(400)
      .json({ error: "No google token and/or user info provided" });
  }

  const user = await getUserByEmail(userInfo.email);

  let userId;
  if (!user) {
    // 1st time login
    userId = await insertNewUser(userInfo, googleToken);
  } else {
    userId = user.id;
  }

  const accessToken = await createAccessToken({ id: userId });
  const refreshToken = await createRefreshToken({ id: userId });

  await updateTokensForUser(userId, refreshToken, accessToken);

  res.status(200).json({
    accessToken,
    refreshToken,
  });
};

export const getUserInfo = async (req, res) => {
  const objects = await pool.query(
    "SELECT id, firstname, lastname, email, nickname, profileimage FROM users WHERE id = $1",
    [req.userId]
  );
  if (objects.rows.length === 1) {
    return res.json(objects.rows[0]);
  }
};

export const updateUserNickname = async (req, res) => {
  const { nickName } = req.body;
  console.log(req.body);
  if (!nickName) {
    return res.status(400).json({ error: "No google nick name provided" });
  }
  await pool.query(`UPDATE USERS SET nickname = $1 WHERE id = $2`, [
    nickName,
    req.userId,
  ]);
  res.status(200).json({ status: "User updated successfully" });
};

export const removeUser = async (req, res) => {
  await pool.query(`DELETE FROM users WHERE id = $1`, [req.userId]);
  res.json({ message: "User deleted successfully" });
};
