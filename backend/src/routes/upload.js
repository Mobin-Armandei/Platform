const express = require("express");
const path = require("path");
const multer = require("multer");
const isAuthenticated = require("../middleware/auth");

const router = express.Router();

const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

router.post("/image", isAuthenticated, upload.single("image"), (req, res) => {
  res.json({
    url: `http://localhost:5000/uploads/${req.file.filename}`,
  });
});

module.exports = router;