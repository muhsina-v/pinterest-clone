import multer from "multer";
import cloudinary from "../config/cloudinary.js";
import { CloudinaryStorage } from "multer-storage-cloudinary";


const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "Pinterest",
    allowed_formats: ["jpg", "png", "jpeg", "mp4", "mov", "avif", "mkv","webp"],
  },
});

const upload = multer({ storage });

export default upload;
