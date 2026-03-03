import { diskStorage } from 'multer';
import { extname } from 'path';
import { randomUUID } from 'crypto';

export const multerOptions = {
  storage: diskStorage({
    destination: './uploads',
    filename: (req: any, file: any, callback: any) => {
      const uniqueName = `${randomUUID()}${extname(file.originalname)}`;
      callback(null, uniqueName);
    },
  }),
  limits: {
    fileSize: 25 * 1024 * 1024, // 10MB
    files: 5,
  },
  fileFilter: (req: any, file: any, callback: any) => {
    const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (allowedMimeTypes.includes(file.mimetype)) {
      callback(null, true);
    } else {
      callback(new Error('Faqat rasm fayllari qabul qilinadi (jpeg, png, webp, gif)'), false);
    }
  },
};