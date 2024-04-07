import multer, { diskStorage } from "multer";

const upload = multer({
  storage: diskStorage({
    destination: process.cwd() + "/public/imgs",
    filename: (req, file, callback)=>{
        callback(null, new Date().getTime() + "_" + file.originalname);
    }
  }),
});

export default upload;
