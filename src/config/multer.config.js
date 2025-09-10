import multer from 'multer';
import path from 'path';
import fs from 'fs';
// 📂 Configuración de almacenamiento local temporal
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // carpeta temporal
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname); // extensión original
    const name = path.basename(file.originalname, ext);
    cb(null, `${name}-${Date.now()}${ext}`);
  },
});

// 🛡️ Filtro para solo aceptar imágenes
const fileFilter = (req, file, cb) => {
  const allowed = ['image/jpeg', 'image/png', 'image/webp'];
  if (allowed.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Solo se permiten imágenes (jpg, png, webp)'), false);
  }
};
/**
 * Elimina un archivo local de forma segura
 * @param {string} filePath - Ruta absoluta o relativa del archivo a borrar
 */
export const deleteLocalIMG = (filePath) => {
  try {
    const absolutePath = path.isAbsolute(filePath)
      ? filePath
      : path.join(process.cwd(), filePath);

    if (fs.existsSync(absolutePath)) {
      fs.unlinkSync(absolutePath);
      console.log("Archivo eliminado:", absolutePath);
    } else {
      console.warn("El archivo no existe:", absolutePath);
    }
  } catch (error) {
    console.error("Error eliminando archivo:", error);
  }
};


// 🚀 Exporto la configuración lista
export const upload = multer({ storage, fileFilter });
