import multer from 'multer';

export const upload = multer({
  storage: multer.memoryStorage(), // il file resta in RAM
  limits: { fileSize: 5 * 1024 * 1024 } // max 5MB
});
