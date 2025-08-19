const express = require("express");
const multer = require("multer");
const path = require("path");

const router = express.Router();

// define pasta de destino
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads_img/"); // pasta onde salvar
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

// rota POST /api/uploads/evidencias
router.post("/evidencias", upload.single("foto"), (req, res) => {  
  if (!req.file) {
    return res.status(400).json({ error: "Nenhum arquivo enviado" });
  }

  const fileUrl = `/uploads/${req.file.filename}`;
  return res.json({ url: fileUrl });
});

module.exports = router;
