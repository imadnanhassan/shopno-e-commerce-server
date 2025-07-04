import { v2 as cloudinary } from 'cloudinary';
import { env } from '../config/env';
import { AppError } from '../error/AppError';


cloudinary.config({
  cloud_name: env.CLOUDINARY_CLOUD_NAME,
  api_key: env.CLOUDINARY_API_KEY,
  api_secret: env.CLOUDINARY_API_SECRET,
});

export const sendImageToCloudinary = async (
  file: Express.Multer.File
): Promise<string> => {
  if (!file) {
    throw new AppError('No file uploaded', 400);
  }

  try {
    const result = await cloudinary.uploader.upload(file.path, {
      folder: 'ecommerce/products',
      use_filename: true,
      unique_filename: false,
    });
    return result.secure_url;
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    throw new AppError(`Cloudinary upload failed: ${message}`, 500);
  }
};
