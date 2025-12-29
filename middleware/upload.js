import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary.js";

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "cbt_faces",
    allowed_formats: ["jpg", "png", "jpeg"],
    transformation: [
      { width: 500, height: 500, crop: "limit" },
      { quality: "auto" },
    ],
  },
});

const upload = multer({ storage });

export default upload;
