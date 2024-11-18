import CloudinaryAdapter from "../adapters/cloudinary.adapter.js";
import { pool } from "../db.js";

export const createUpload = async (req, res) => {
  try {
    if (!req.file) {
      throw new Error("No file uploaded");
    }

    const imageUrl = await CloudinaryAdapter.uploadImage(req.file.buffer);

    const query = `
      UPDATE users
      SET profileimage = $1
      WHERE id = $2;
    `;

    const values = [imageUrl, req.userId];

    await pool.query(query, values);

    res.json({ imageUrl });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ error: `Something went wrong: ${error.message}` });
  }
};
