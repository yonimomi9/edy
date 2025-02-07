const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let uploadPath;

    try {
      console.log("[DEBUG] Determining upload path for file fieldname:", file.fieldname);

      if (file.fieldname === "file") {
        uploadPath = path.join(__dirname, "../app/web/public/movies");
        console.log("[DEBUG] Upload path for movie file:", uploadPath);
      } else if (file.fieldname === "thumbnail") {
        uploadPath = path.join(__dirname, "../app/web/public/thumbnails");
        console.log("[DEBUG] Upload path for thumbnail:", uploadPath);
      } else if (file.fieldname === "profilePicture") {
        uploadPath = path.join(__dirname, "../app/web/public/profilePictures");
        console.log("[DEBUG] Upload path for profile picture:", uploadPath);
      } else {
        console.error("[ERROR] Invalid fieldname:", file.fieldname);
        return cb(new Error(`Invalid fieldname: ${file.fieldname}`), false);
      }

      console.log("[DEBUG] Final upload destination:", uploadPath);
      cb(null, uploadPath);
    } catch (err) {
      console.error("[ERROR] Exception in destination callback:", err);
      cb(err, false);
    }
  },
  filename: (req, file, cb) => {
    console.log("[DEBUG] Generating filename for fieldname:", file.fieldname);

    try {
      const uniqueFilename = `${Date.now()}-${file.originalname.replace(/[^a-zA-Z0-9.]/g, "_")}`;
      console.log("[DEBUG] Generated filename:", uniqueFilename);
      cb(null, uniqueFilename);
    } catch (err) {
      console.error("[ERROR] Exception in filename callback:", err);
      cb(err, false);
    }
  },
});

const upload = multer({
  storage,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB file size limit
  },
  fileFilter: (req, file, cb) => {
    console.log("[DEBUG] Checking file type for:", file.mimetype);

    const allowedMimeTypes = ["image/jpeg", "image/png", "video/mp4"];
    if (allowedMimeTypes.includes(file.mimetype)) {
      console.log("[DEBUG] File type allowed:", file.mimetype);
      cb(null, true); // Allow the file
    } else {
      console.error("[ERROR] Unsupported file type:", file.mimetype);
      cb(new Error("Unsupported file type."), false);
    }
  },
});

module.exports = upload;
