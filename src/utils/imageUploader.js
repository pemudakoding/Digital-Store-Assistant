import { ImageUploadService } from 'node-upload-images';

/**
 * Upload image to permanent hosting service
 * @param {Buffer} mediaData - Image buffer data
 * @returns {Promise<string>} Image URL
 */
export async function uploadImage(mediaData) {
    try {
        const service = new ImageUploadService("pixhost.to");
        const { directLink } = await service.uploadFromBinary(
            mediaData,
            `koalastore_${Date.now()}.jpg`
        );
        return directLink.toString();
    } catch (err) {
        console.error('Image upload error:', err);
        throw new Error(`Upload failed: ${err.message}`);
    }
} 