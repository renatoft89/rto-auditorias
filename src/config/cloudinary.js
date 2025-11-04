const { v2: cloudinary } = require('cloudinary');

const requiredEnv = [
  'CLOUDINARY_CLOUD_NAME',
  'CLOUDINARY_API_KEY',
  'CLOUDINARY_API_SECRET',
];

const missing = requiredEnv.filter((envKey) => !process.env[envKey]);

if (missing.length > 0) {
  const message = `Variáveis de ambiente ausentes para configuração do Cloudinary: ${missing.join(', ')}`;
  throw new Error(message);
}

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

module.exports = cloudinary;