import { v2 as cloudinary } from "cloudinary";
import {
  CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET,
} from "../config.js";

class CloudinaryAdapter {
  constructor() {
    cloudinary.config({
      cloud_name: CLOUDINARY_CLOUD_NAME,
      api_key: CLOUDINARY_API_KEY,
      api_secret: CLOUDINARY_API_SECRET,
    });
  }

  async uploadImage(imageBuffer) {
    try {
      return new Promise((resolve, reject) => {
        cloudinary.uploader
          .upload_stream((error, result) => {
            if (error) {
              console.error("Error uploading to Cloudinary:", error);
              reject(error.message);
            }
            resolve(result.secure_url);
          })
          .end(imageBuffer);
      });
    } catch (error) {
      console.error("Error uploading to Cloudinary:", error);
      throw error;
    }
  }
}

export default new CloudinaryAdapter();
