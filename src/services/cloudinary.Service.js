import cloudinary from '../config/cloudinary.config.js';

class CloudinaryService {
  // 📤 Subir imagen
  async uploadIMG(filePath, publicId = null) {
    try {
      const options = {};
      if (publicId) options.public_id = publicId;

      const result = await cloudinary.uploader.upload(filePath, options);
      return result.secure_url;
    } catch (error) {
      console.error('❌ Error al subir imagen:', error);
      throw error;
    }
  }

  // 🔗 Generar URL de imagen
  findIMG(publicId, options = {}) {
    try {
      return cloudinary.url(publicId, {
        fetch_format: 'auto',
        quality: 'auto',
        ...options,
      });
    } catch (error) {
      console.error('❌ Error al generar URL:', error);
      throw error;
    }
  }

  // 🗑️ Eliminar imagen
  async deleteIMG(publicId) {
    try {
      const result = await cloudinary.uploader.destroy(publicId);
      return result;
    } catch (error) {
      console.error('❌ Error al eliminar imagen:', error);
      throw error;
    }
  }

  // 🔄 Actualizar imagen (borra la anterior y sube la nueva con el mismo publicId)
  async updateIMG(filePath, publicId) {
    try {
      // primero borro la anterior (si existe)
      await cloudinary.uploader.destroy(publicId);

      // subo la nueva con el mismo publicId
      const result = await cloudinary.uploader.upload(filePath, {
        public_id: publicId,
      });

      return result.secure_url;
    } catch (error) {
      console.error('❌ Error al actualizar imagen:', error);
      throw error;
    }
  }
}

export default new CloudinaryService();
