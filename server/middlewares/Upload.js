import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";


const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "Pinterest",
    allowed_formats: ["jpg", "png", "jpeg", "mp4", "mov", "avif", "mkv",],
  },
});

const upload = multer({ storage });

export default upload;
