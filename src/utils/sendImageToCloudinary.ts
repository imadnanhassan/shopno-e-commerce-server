import { v2 as cloudinary } from 'cloudinary';
import { env } from '../config/env';

cloudinary.config({
  cloud_name: env.CLOUDINARY_CLOUD_NAME,
  api_key: env.CLOUDINARY_API_KEY,
  api_secret: env.CLOUDINARY_API_SECRET,
});

export const sendImageToCloudinary = async (
  file: Express.Multer.File
): Promise<string> => {
  try {
    const result = await cloudinary.uploader.upload(file.path, {
      folder: 'ecommerce/products',
      use_filename: true,
      unique_filename: false,
    });
    return result.secure_url;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Cloudinary upload failed: ${error.message}`);
    } else {
      throw new Error('Cloudinary upload failed: Unknown error');
    }
  }
};
