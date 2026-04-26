import express from 'express';
import multer, { MulterError } from 'multer';
import cloudinary from '../config/cloudinary.js';
import { Readable } from 'stream';
import path from 'path';

const router = express.Router();

// Use memory storage — file is buffered in RAM then streamed to Cloudinary
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
});

function bufferToStream(buffer: Buffer): Readable {
  const readable = new Readable();
  readable.push(buffer);
  readable.push(null);
  return readable;
}

router.post('/', (req, res, next) => {
  // Wrap multer to catch MulterError (e.g. file too large) and return 400
  upload.single('file')(req, res, (err) => {
    if (err instanceof MulterError) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ error: 'File is too large. Maximum upload size is 10 MB.' });
      }
      return res.status(400).json({ error: err.message });
    }
    if (err) {
      return res.status(500).json({ error: 'File upload error' });
    }
    next();
  });
}, async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  try {
    // Extract original filename and extension for Cloudinary
    const originalName = req.file.originalname || 'upload';
    const ext = path.extname(originalName).replace('.', '').toLowerCase();
    const baseName = path.basename(originalName, path.extname(originalName))
      .replace(/[^a-zA-Z0-9_-]/g, '_'); // sanitize

    // Upload buffer to Cloudinary via upload_stream
    const result: any = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: 'flow-agent-uploads',
          resource_type: 'auto', // handles PDFs, images, etc.
          public_id: `${baseName}_${Date.now()}`,
          format: ext || undefined, // pass the original extension so Cloudinary knows the format
          use_filename: true,
          unique_filename: true,
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      bufferToStream(req.file!.buffer).pipe(stream);
    });

    res.status(200).json({
      message: 'File uploaded successfully',
      filename: result.public_id,
      url: result.secure_url,
    });
  } catch (err: any) {
    console.error('[Upload Error]', err);
    res.status(500).json({ error: err.message || 'Upload to Cloudinary failed' });
  }
});

export default router;

