export const PORT = process.env.PORT || 3000;

export const JWT_SECRET_KEY =
  process.env.JWT_SECRET_KEY || "your_secret_jwt_key";

export const PG_PORT = process.env.PG_PORT || 5432;
export const PG_HOST = process.env.PG_HOST || "localhost";
export const PG_USER = process.env.PG_USER || "postgres";
export const PG_PASSWORD = process.env.PG_PASSWORD || "your_secret_pg_password";
export const PG_DATABASE = process.env.PG_DATABASE || "your_db";

export const CLOUDINARY_CLOUD_NAME =
  process.env.CLOUDINARY_CLOUD_NAME || "your_cloud_name";
export const CLOUDINARY_API_KEY =
  process.env.CLOUDINARY_API_KEY || "your_api_key";
export const CLOUDINARY_API_SECRET =
  process.env.CLOUDINARY_API_SECRET || "your_api_secret";
