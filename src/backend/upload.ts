import multer from "multer"

// It will make the uploaded files turn into buffers
const storage = multer.memoryStorage()

// Initializes multer
const upload = multer({
  storage,
  limits: {
    // 2GB
    fileSize: 1024 * 1024 * 2000,
  },
})

export default upload
