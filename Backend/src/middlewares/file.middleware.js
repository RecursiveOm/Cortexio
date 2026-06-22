import multer from "multer";

const upload = multer({
    storage: multer.memoryStorage(), // store file temporarily in memory
    limits: {
        fileSize: 10 * 1024 * 1024 // 10 MB
    }
});

export default upload;