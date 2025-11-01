const extractPublicIdFromUrl = (fileUrl) => {
  if (!fileUrl) {
    return null;
  }

  try {
    const url = new URL(fileUrl);
    const pathParts = url.pathname.split('/').filter(Boolean);

    const uploadIndex = pathParts.findIndex((segment) =>
      ['upload', 'private', 'authenticated'].includes(segment)
    );

    if (uploadIndex === -1) {
      return null;
    }

    const publicIdParts = pathParts.slice(uploadIndex + 1);

    if (publicIdParts[0] && /^v\d+$/.test(publicIdParts[0])) {
      publicIdParts.shift();
    }

    if (publicIdParts.length === 0) {
      return null;
    }

    const lastPart = publicIdParts.pop();
    const lastWithoutExtension = lastPart.replace(/\.[^/.]+$/, '');
    publicIdParts.push(lastWithoutExtension);

    return publicIdParts.join('/');
  } catch (error) {
    console.error('Não foi possível extrair o public_id da URL do Cloudinary:', error);
    return null;
  }
};

module.exports = {
  extractPublicIdFromUrl,
};