/**
 * Media Processing Service
 * Handles image/video processing, sticker creation, and file uploads
 */

import fs from 'fs';
import crypto from 'crypto';
import ff from 'fluent-ffmpeg';
import webp from 'node-webpmux';
import { ImageUploadService } from 'node-upload-images';

class MediaService {
    
    /**
     * Convert image to WebP format
     * @param {Buffer} media - Image buffer
     * @returns {Promise<Buffer>} WebP buffer
     */
    async imageToWebp(media) {
        const tmpFileOut = `./gambar/${crypto.randomBytes(6).readUIntLE(0, 6).toString(36)}.webp`;
        const tmpFileIn = `./gambar/${crypto.randomBytes(6).readUIntLE(0, 6).toString(36)}.jpg`;

        fs.writeFileSync(tmpFileIn, media);

        await new Promise((resolve, reject) => {
            ff(tmpFileIn)
                .on('error', reject)
                .on('end', () => resolve(true))
                .addOutputOptions([
                    '-vcodec',
                    'libwebp',
                    '-vf',
                    "scale='min(320,iw)':min'(320,ih)':force_original_aspect_ratio=decrease,fps=15, pad=320:320:-1:-1:color=white@0.0, split [a][b]; [a] palettegen=reserve_transparent=on:transparency_color=ffffff [p]; [b][p] paletteuse"
                ])
                .toFormat('webp')
                .save(tmpFileOut);
        });

        const buff = fs.readFileSync(tmpFileOut);
        this.cleanup(tmpFileOut, tmpFileIn);
        return buff;
    }

    /**
     * Convert video to WebP format
     * @param {Buffer} media - Video buffer
     * @returns {Promise<Buffer>} WebP buffer
     */
    async videoToWebp(media) {
        const tmpFileOut = `./gambar/${crypto.randomBytes(6).readUIntLE(0, 6).toString(36)}.webp`;
        const tmpFileIn = `./gambar/${crypto.randomBytes(6).readUIntLE(0, 6).toString(36)}.mp4`;

        fs.writeFileSync(tmpFileIn, media);

        await new Promise((resolve, reject) => {
            ff(tmpFileIn)
                .on('error', reject)
                .on('end', () => resolve(true))
                .addOutputOptions([
                    '-vcodec',
                    'libwebp',
                    '-vf',
                    "scale='min(320,iw)':min'(320,ih)':force_original_aspect_ratio=decrease,fps=15, pad=320:320:-1:-1:color=white@0.0, split [a][b]; [a] palettegen=reserve_transparent=on:transparency_color=ffffff [p]; [b][p] paletteuse",
                    '-loop',
                    '0',
                    '-ss',
                    '00:00:00',
                    '-t',
                    '00:00:05',
                    '-preset',
                    'default',
                    '-an',
                    '-vsync',
                    '0'
                ])
                .toFormat('webp')
                .save(tmpFileOut);
        });

        const buff = fs.readFileSync(tmpFileOut);
        this.cleanup(tmpFileOut, tmpFileIn);
        return buff;
    }

    /**
     * Write EXIF data to image sticker
     * @param {Buffer} media - Image buffer
     * @param {Object} metadata - Sticker metadata
     * @returns {Promise<string>} Output file path
     */
    async writeExifImg(media, metadata) {
        const wMedia = await this.imageToWebp(media);
        const tmpFileIn = `./gambar/${crypto.randomBytes(6).readUIntLE(0, 6).toString(36)}.webp`;
        const tmpFileOut = `./gambar/${crypto.randomBytes(6).readUIntLE(0, 6).toString(36)}.webp`;
        
        fs.writeFileSync(tmpFileIn, wMedia);

        if (metadata.packname || metadata.author) {
            const img = new webp.Image();
            const json = {
                'sticker-pack-id': 'https://github.com/koalastore/bot',
                'sticker-pack-name': metadata.packname,
                'sticker-pack-publisher': metadata.author,
                'emojis': metadata.categories ? metadata.categories : ['']
            };
            
            const exifAttr = Buffer.from([0x49, 0x49, 0x2A, 0x00, 0x08, 0x00, 0x00, 0x00, 0x01, 0x00, 0x41, 0x57, 0x07, 0x00, 0x00, 0x00, 0x00, 0x00, 0x16, 0x00, 0x00, 0x00]);
            const jsonBuff = Buffer.from(JSON.stringify(json), 'utf-8');
            const exif = Buffer.concat([exifAttr, jsonBuff]);
            exif.writeUIntLE(jsonBuff.length, 14, 4);
            
            await img.load(tmpFileIn);
            fs.unlinkSync(tmpFileIn);
            img.exif = exif;
            await img.save(tmpFileOut);
            
            return tmpFileOut;
        }
    }

    /**
     * Write EXIF data to video sticker
     * @param {Buffer} media - Video buffer
     * @param {Object} metadata - Sticker metadata
     * @returns {Promise<string>} Output file path
     */
    async writeExifVid(media, metadata) {
        const wMedia = await this.videoToWebp(media);
        const tmpFileIn = `./gambar/${crypto.randomBytes(6).readUIntLE(0, 6).toString(36)}.webp`;
        const tmpFileOut = `./gambar/${crypto.randomBytes(6).readUIntLE(0, 6).toString(36)}.webp`;
        
        fs.writeFileSync(tmpFileIn, wMedia);

        if (metadata.packname || metadata.author) {
            const img = new webp.Image();
            const json = {
                'sticker-pack-id': 'https://github.com/koalastore/bot',
                'sticker-pack-name': metadata.packname,
                'sticker-pack-publisher': metadata.author,
                'emojis': metadata.categories ? metadata.categories : ['']
            };
            
            const exifAttr = Buffer.from([0x49, 0x49, 0x2A, 0x00, 0x08, 0x00, 0x00, 0x00, 0x01, 0x00, 0x41, 0x57, 0x07, 0x00, 0x00, 0x00, 0x00, 0x00, 0x16, 0x00, 0x00, 0x00]);
            const jsonBuff = Buffer.from(JSON.stringify(json), 'utf-8');
            const exif = Buffer.concat([exifAttr, jsonBuff]);
            exif.writeUIntLE(jsonBuff.length, 14, 4);
            
            await img.load(tmpFileIn);
            fs.unlinkSync(tmpFileIn);
            img.exif = exif;
            await img.save(tmpFileOut);
            
            return tmpFileOut;
        }
    }

    /**
     * Auto-detect and write EXIF data
     * @param {Object} media - Media object with data and mimetype
     * @param {Object} metadata - Sticker metadata
     * @returns {Promise<string>} Output file path
     */
    async writeExif(media, metadata) {
        let wMedia = /webp/.test(media.mimetype) ? media.data 
                  : /image/.test(media.mimetype) ? await this.imageToWebp(media.data) 
                  : /video/.test(media.mimetype) ? await this.videoToWebp(media.data) : '';
                  
        const tmpFileIn = `./gambar/${crypto.randomBytes(6).readUIntLE(0, 6).toString(36)}.webp`;
        const tmpFileOut = `./gambar/${crypto.randomBytes(6).readUIntLE(0, 6).toString(36)}.webp`;
        
        fs.writeFileSync(tmpFileIn, wMedia);

        if (metadata.packname || metadata.author) {
            const img = new webp.Image();
            const json = {
                'sticker-pack-id': 'https://github.com/koalastore/bot',
                'sticker-pack-name': metadata.packname,
                'sticker-pack-publisher': metadata.author,
                'emojis': metadata.categories ? metadata.categories : ['']
            };
            
            const exifAttr = Buffer.from([0x49, 0x49, 0x2A, 0x00, 0x08, 0x00, 0x00, 0x00, 0x01, 0x00, 0x41, 0x57, 0x07, 0x00, 0x00, 0x00, 0x00, 0x00, 0x16, 0x00, 0x00, 0x00]);
            const jsonBuff = Buffer.from(JSON.stringify(json), 'utf-8');
            const exif = Buffer.concat([exifAttr, jsonBuff]);
            exif.writeUIntLE(jsonBuff.length, 14, 4);
            
            await img.load(tmpFileIn);
            fs.unlinkSync(tmpFileIn);
            img.exif = exif;
            await img.save(tmpFileOut);
            
            return tmpFileOut;
        }
    }

    /**
     * Upload file to permanent hosting service
     * @param {string} filePath - Path to file
     * @returns {Promise<Object>} Upload response with URL
     */
    async uploadFile(filePath) {
        try {
            const buffer = fs.readFileSync(filePath);
            const service = new ImageUploadService("pixhost.to");
            const { directLink } = await service.uploadFromBinary(
                buffer,
                `koalastore_${Date.now()}.jpg`
            );
            return { url: directLink.toString() };
        } catch (err) {
            console.error('Upload error:', err);
            throw new Error(`Upload failed: ${err.message}`);
        }
    }

    /**
     * Clean up temporary files
     * @param {...string} files - File paths to cleanup
     */
    cleanup(...files) {
        files.forEach(file => {
            if (fs.existsSync(file)) {
                fs.unlinkSync(file);
            }
        });
    }
}

export default MediaService; 