import { diskStorage } from 'multer';
import { extname } from 'path';
import * as fs from 'fs';

const uploadPath = './uploads';

if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath);
}

export const multerOptions = {
  storage: diskStorage({
    destination: uploadPath,
    filename: (req, file, cb) => {
      const randomName =
        Date.now() + '-' + Math.round(Math.random() * 1e9);
      cb(null, `${randomName}${extname(file.originalname)}`);
    },
  }),
  limits: { fileSize: 5 * 1024 * 1024 },
};
