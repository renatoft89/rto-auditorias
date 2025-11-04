const express = require("express");
const router = express.Router();
const multer = require("multer");

const uploadMiddleware = require('../../middlewares/ValidaEvidenciasFotos');
const optimizeImage = require('../../middlewares/otimizaImg');

const { salvafotoAuditoria, deletarArquivo } = require('../../controllers/arquivos.controller');

const uploadSingleFoto = uploadMiddleware.single("foto");

router.post("/upload", (req, res) => {
  uploadSingleFoto(req, res, (uploadErr) => {
    if (uploadErr) {
      console.error('Erro ao enviar a evidência para upload:', uploadErr);
      const statusCode = uploadErr instanceof multer.MulterError ? 400 : 500;
      const message = uploadErr.message || 'Falha ao enviar o arquivo.';
      return res.status(statusCode).json({ mensagem: message });
    }

    optimizeImage(req, res, (optimizeErr) => {
      if (optimizeErr) {
        console.error('Erro ao otimizar a evidência enviada:', optimizeErr);
        const message = optimizeErr.message || 'Falha ao processar a imagem.';
        return res.status(500).json({ mensagem: message });
      }

      if (!req.file) {
        return res.status(400).json({ mensagem: "Nenhum arquivo enviado." });
      }

      const fileUrl = req.file.path || req.file.secure_url;

      if (!fileUrl) {
        console.error('Upload concluído, mas o provedor não retornou uma URL acessível.', req.file);
        return res.status(500).json({ mensagem: "Falha ao obter a URL do arquivo enviado." });
      }

      return res.status(200).json({ url: fileUrl });
    });
  });
});

router.post("/salvar-foto", salvafotoAuditoria);
router.delete("/apagar", deletarArquivo);

module.exports = router;
