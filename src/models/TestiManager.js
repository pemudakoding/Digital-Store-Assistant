/**
 * Testimonial Manager Model
 * Handles testimonial operations
 */

import fs from "fs";

class TestiManager {
    constructor() {
        this.testiPath = "./database/list-testi.json";
    }

    /**
     * Get testimonial database
     * @returns {Array} Testimonial database
     */
    getTestiDb() {
        try {
            if (!fs.existsSync(this.testiPath)) {
                fs.writeFileSync(this.testiPath, "[]");
            }
            const data = fs.readFileSync(this.testiPath);
            return JSON.parse(data);
        } catch (error) {
            console.error("Error reading testimonial database:", error);
            return [];
        }
    }

    /**
     * Add new testimonial
     * @param {string} key - Testimonial key
     * @param {string} response - Testimonial response
     * @param {boolean} isImage - Has image
     * @param {string} imageUrl - Image URL
     * @param {Array} db - Database array
     */
    addResponTesti(key, response, isImage, imageUrl, db) {
        const obj = {
            key: key,
            response: response,
            isImage: isImage,
            image_url: imageUrl,
        };
        db.push(obj);
        fs.writeFileSync(this.testiPath, JSON.stringify(db, null, 3));
    }

    /**
     * Get testimonial data
     * @param {string} key - Testimonial key
     * @param {Array} db - Database array
     * @returns {Object|null} Testimonial data
     */
    getDataResponTesti(key, db) {
        return db.find(item => item.key === key) || null;
    }

    /**
     * Check if testimonial already exists
     * @param {string} key - Testimonial key
     * @param {Array} db - Database array
     * @returns {boolean} Does exist
     */
    isAlreadyResponTesti(key, db) {
        return db.some(item => item.key === key);
    }

    /**
     * Get testimonial response
     * @param {string} key - Testimonial key
     * @param {Array} db - Database array
     * @returns {string|null} Response text
     */
    sendResponTesti(key, db) {
        const item = db.find(item => item.key === key);
        return item ? item.response : null;
    }

    /**
     * Reset all testimonials
     * @param {Array} db - Database array
     */
    resetTestiAll(db) {
        db.length = 0;
        fs.writeFileSync(this.testiPath, JSON.stringify(db, null, 3));
    }

    /**
     * Delete testimonial
     * @param {string} key - Testimonial key
     * @param {Array} db - Database array
     */
    delResponTesti(key, db) {
        const index = db.findIndex(item => item.key === key);
        if (index !== -1) {
            db.splice(index, 1);
            fs.writeFileSync(this.testiPath, JSON.stringify(db, null, 3));
        }
    }

    /**
     * Update testimonial
     * @param {string} key - Testimonial key
     * @param {string} response - New response
     * @param {boolean} isImage - Has image
     * @param {string} imageUrl - Image URL
     * @param {Array} db - Database array
     */
    updateResponTesti(key, response, isImage, imageUrl, db) {
        const index = db.findIndex(item => item.key === key);
        if (index !== -1) {
            db[index].response = response;
            db[index].isImage = isImage;
            db[index].image_url = imageUrl;
            fs.writeFileSync(this.testiPath, JSON.stringify(db, null, 3));
        }
    }
}

export default TestiManager; 