const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const removeFileIfExists = (filepath) => {
  if (!filepath) {
    return;
  }
  try {
    if (fs.existsSync(filepath)) {
      fs.unlinkSync(filepath);
    }
  } catch (removeError) {
    console.error('Erro ao remover arquivo temporário:', removeError);
  }
};

const otimizarImagem = async (req, res, next) => {
  if (!req.file) {
    return next();
  }

  if (req.file.path && req.file.path.startsWith('http')) {
    // Uploads enviados diretamente para o Cloudinary já são entregues otimizados via CDN.
    return next();
  }

  if (!req.file.destination) {
    return next();
  }

  const originalPath = req.file.path;
  const originalFilename = req.file.filename || path.basename(originalPath);
  const optimizedFilename = `${path.parse(originalFilename).name}.webp`;
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
    removeFileIfExists(originalPath);

    return next();
  } catch (error) {
    console.error('Erro ao otimizar a imagem:', error);
    removeFileIfExists(originalPath);
    const optimizationError = new Error('Falha ao processar a imagem.');
    optimizationError.cause = error;
    return next(optimizationError);
  }
};

module.exports = otimizarImagem;
