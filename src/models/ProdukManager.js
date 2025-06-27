/**
 * Produk Manager Model
 * Handles product database operations
 */

import fs from "fs";

class ProdukManager {
    constructor() {
        this.produkPath = "./database/list-produk.json";
    }

    /**
     * Get produk database
     * @returns {Array} Produk database
     */
    getProdukDb() {
        try {
            if (!fs.existsSync(this.produkPath)) {
                fs.writeFileSync(this.produkPath, "[]");
            }
            const data = fs.readFileSync(this.produkPath);
            return JSON.parse(data);
        } catch (error) {
            console.error("Error reading produk database:", error);
            return [];
        }
    }

    /**
     * Save produk database
     * @param {Array} data - Produk data to save
     */
    saveProdukDb(data) {
        try {
            fs.writeFileSync(this.produkPath, JSON.stringify(data, null, 3));
        } catch (error) {
            console.error("Error saving produk database:", error);
        }
    }

    /**
     * Add new product
     * @param {string} key - Product key
     * @param {string} response - Product response
     * @param {boolean} isImage - Has image
     * @param {string} imageUrl - Image URL
     * @param {Array} db - Database array
     */
    addResponProduk(key, response, isImage, imageUrl, db) {
        const obj = {
            key: key,
            response: response,
            isImage: isImage,
            image_url: imageUrl,
        };
        db.push(obj);
        this.saveProdukDb(db);
    }

    /**
     * Get product data
     * @param {string} key - Product key
     * @param {Array} db - Database array
     * @returns {Object|null} Product data
     */
    getDataResponProduk(key, db) {
        return db.find(item => item.key === key) || null;
    }

    /**
     * Check if product already exists
     * @param {string} key - Product key
     * @param {Array} db - Database array
     * @returns {boolean} Does exist
     */
    isAlreadyResponProduk(key, db) {
        return db.some(item => item.key === key);
    }

    /**
     * Get product response
     * @param {string} key - Product key
     * @param {Array} db - Database array
     * @returns {string|null} Response text
     */
    sendResponProduk(key, db) {
        const item = db.find(item => item.key === key);
        return item ? item.response : null;
    }

    /**
     * Delete product
     * @param {string} key - Product key
     * @param {Array} db - Database array
     */
    delResponProduk(key, db) {
        const index = db.findIndex(item => item.key === key);
        if (index !== -1) {
            db.splice(index, 1);
            this.saveProdukDb(db);
        }
    }

    /**
     * Update product
     * @param {string} key - Product key
     * @param {string} response - New response
     * @param {boolean} isImage - Has image
     * @param {string} imageUrl - Image URL
     * @param {Array} db - Database array
     */
    updateResponProduk(key, response, isImage, imageUrl, db) {
        const index = db.findIndex(item => item.key === key);
        if (index !== -1) {
            db[index].response = response;
            db[index].isImage = isImage;
            db[index].image_url = imageUrl;
            this.saveProdukDb(db);
        }
    }

    /**
     * Reset all products
     * @param {Array} db - Database array
     */
    resetProdukAll(db) {
        db.length = 0;
        this.saveProdukDb(db);
    }
}

export default ProdukManager; 