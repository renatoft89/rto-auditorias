const ArquivosModel = require('../models/Arquivos.Model')
const cloudinary = require('../config/cloudinary');
const { extractPublicIdFromUrl } = require('../utils/cloundinary');

const salvarArquivoAuditoria = async (id_resposta, tipo, caminho) => {
  if (!id_resposta || !tipo || !caminho) {
    throw new Error('Dados obrigatórios para salvar o arquivo estão faltando.');
  }

  if (!['Foto', 'Video', 'Arquivo'].includes(tipo)) {
    throw new Error('Tipo de arquivo inválido. Deve ser "Foto", "Video" ou "Arquivo".');
  }

  const novoArquivoId = await ArquivosModel.inserirArquivos({ id_resposta, tipo, caminho });

  return {
    id: novoArquivoId,
    id_resposta,
    tipo,
    caminho
  };
};

const deletarArquivo = async (caminhoUrl) => {
  if (!caminhoUrl) {
    throw new Error('Caminho do arquivo é obrigatório para exclusão.');
  }

  const publicId = extractPublicIdFromUrl(caminhoUrl);


  if (publicId) {
    try {
      await cloudinary.uploader.destroy(publicId);
    } catch (error) {
      console.error(`Erro ao deletar arquivo no Cloudinary (${publicId}):`, error);
    }
  } else {
    console.warn(`Não foi possível identificar o public_id do arquivo ${caminhoUrl} para exclusão no Cloudinary.`);
  }

    const linhasAfetadas = await ArquivosModel.deletarArquivoPorCaminho(caminhoUrl);

    if (linhasAfetadas === 0) {
      console.warn(`Registro do arquivo ${caminhoUrl} não encontrado no banco de dados.`);
    } else {
      console.log(`Registro do arquivo ${caminhoUrl} deletado do banco de dados.`);
    }

    return { mensagem: 'Arquivo deletado com sucesso (se encontrado).' };
  };

  module.exports = {
    salvarArquivoAuditoria,
    deletarArquivo
  };
