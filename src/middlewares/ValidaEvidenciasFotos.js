const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");


// Caminho absoluto baseado na raiz do projeto onde os arquivos serão salvos
const defaultFolder = process.env.CLOUDINARY_UPLOAD_FOLDER;

// Garante que o diretório de upload exista.
const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    const baseName = (file.originalname || "arquivo")
      .replace(/\.[^/.]+$/, "")
      .replace(/[^a-zA-Z0-9-_]+/g, "_");
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    return {
      folder: defaultFolder,
      public_id: `${baseName}-${uniqueSuffix}`,
      resource_type: "auto",
      overwrite: false,
    };
  },
});

// Instância do Multer com a configuração de armazenamento definida.
// Este 'upload' será o middleware que você usará nas suas rotas.
const upload = multer({ storage });

module.exports = upload;
