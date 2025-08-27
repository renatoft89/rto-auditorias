const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const otimizarImagem = async (req, res, next) => {
  if (!req.file) {
    return next();
  }

  const originalPath = req.file.path;
  const optimizedFilename = `${path.parse(req.file.filename).name}.webp`;
  const optimizedPath = path.join(req.file.destination, optimizedFilename);

  try {
    await sharp(originalPath)
      .resize(1200) // Redimensiona para 1200px de largura
      .webp({ quality: 80 }) // Converte para WebP com 80% de qualidade
      .toFile(optimizedPath);

    // Atualiza o objeto do request para que a rota use o novo arquivo
    req.file.filename = optimizedFilename;
    req.file.path = optimizedPath;

    // Remove o arquivo temporário original
    fs.unlinkSync(originalPath);

    next();
  } catch (error) {
    console.error('Erro ao otimizar a imagem:', error);
    fs.unlinkSync(originalPath);
    return res.status(500).json({ error: "Falha ao processar a imagem." });
  }
};

module.exports = otimizarImagem;
