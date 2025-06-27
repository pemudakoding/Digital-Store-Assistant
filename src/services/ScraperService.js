/**
 * Scraper Service
 * Handles web scraping operations for social media and other platforms
 */

import axios from 'axios';
import BodyForm from 'form-data';
import Jimp from 'jimp';

class ScraperService {
    
    /**
     * Download TikTok video
     * @param {string} url - TikTok URL
     * @returns {Promise<Object>} Video data
     */
    async downloadTikTok(url) {
        return new Promise(async (resolve, reject) => {
            try {
                const encodedParams = new URLSearchParams();
                encodedParams.set('url', url);
                encodedParams.set('hd', '1');

                const response = await axios({
                    method: 'POST',
                    url: 'https://tikwm.com/api/',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                        'Cookie': 'current_language=en',
                        'User-Agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Mobile Safari/537.36'
                    },
                    data: encodedParams
                });
                
                const videos = response.data.data;
                const result = {
                    title: videos.title,
                    watermark: videos.play,
                    audio: videos.music
                };
                
                resolve(result);
            } catch (error) {
                reject(error);
            }
        });
    }

    /**
     * Enhance image quality using AI
     * @param {Buffer|string} input - Image buffer or path
     * @returns {Promise<Object>} Enhanced image data
     */
    async enhanceImage(input) {
        const image = await Jimp.read(input);
        const buffer = await new Promise((resolve, reject) => {
            image.getBuffer(Jimp.MIME_JPEG, (err, buf) => {
                if (err) {
                    reject('Error getting image buffer');
                } else {
                    resolve(buf);
                }
            });
        });

        const form = new BodyForm();
        form.append('image', buffer, { filename: 'enhance.jpg' });
        
        try {
            const { data } = await axios.post('https://tools.betabotz.eu.org/ai/remini', form, {
                headers: {
                    ...form.getHeaders(),
                    'accept': 'application/json',
                },
            });
            
            return {
                image_data: data.result,
                image_size: data.size
            };
        } catch (error) {
            console.error('Image enhancement failed:', error);
            throw new Error('Image enhancement failed');
        }
    }

    /**
     * Download Instagram media
     * @param {string} url - Instagram URL
     * @returns {Promise<Object>} Media data
     */
    async downloadInstagram(url) {
        try {
            const response = await axios.post('https://downloadgram.io/download.php', {
                url: url
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
                }
            });
            
            return response.data;
        } catch (error) {
            throw new Error('Instagram download failed');
        }
    }

    /**
     * Download YouTube video
     * @param {string} url - YouTube URL
     * @returns {Promise<Object>} Video data
     */
    async downloadYoutube(url) {
        try {
            const response = await axios.get(`https://api.youtubedl-org.com/api/info?url=${encodeURIComponent(url)}`);
            return response.data;
        } catch (error) {
            throw new Error('YouTube download failed');
        }
    }

    /**
     * Search lyrics
     * @param {string} query - Song search query
     * @returns {Promise<Object>} Lyrics data
     */
    async searchLyrics(query) {
        try {
            const response = await axios.get(`https://api.lyrics.ovh/v1/${encodeURIComponent(query)}`);
            return response.data;
        } catch (error) {
            throw new Error('Lyrics search failed');
        }
    }

    /**
     * Get weather information
     * @param {string} location - Location name
     * @returns {Promise<Object>} Weather data
     */
    async getWeather(location) {
        try {
            const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(location)}&appid=YOUR_API_KEY&units=metric`);
            return response.data;
        } catch (error) {
            throw new Error('Weather fetch failed');
        }
    }
}

export default ScraperService; 