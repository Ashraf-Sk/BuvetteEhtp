import multer from 'multer';
import { Request } from 'express';
import { v2 as cloudinaryUploader } from 'cloudinary';
import { env } from '../config/env';

// Configure multer for memory storage
const storage = multer.memoryStorage();

const fileFilter = (
  _req: Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
): void => {
  // Accept images only
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed'));
  }
};

export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
});

const isCloudinaryConfigured = 
  env.CLOUDINARY_CLOUD_NAME && 
  env.CLOUDINARY_API_KEY && 
  env.CLOUDINARY_API_SECRET;

export const uploadToCloudinary = async (
  buffer: Buffer,
  folder: string = 'buvette-ehtp'
): Promise<string> => {
  if (!isCloudinaryConfigured) {
    console.warn('⚠️  Cloudinary not configured - returning placeholder URL');
    // Return a placeholder URL in development
    return 'https://via.placeholder.com/300?text=Image+Upload+Disabled';
  }

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinaryUploader.uploader.upload_stream(
      {
        folder,
        resource_type: 'image',
      },
      (error, result) => {
        if (error) {
          reject(error);
        } else if (result) {
          resolve(result.secure_url);
        } else {
          reject(new Error('Upload failed'));
        }
      }
    );

    uploadStream.end(buffer);
  });
};

