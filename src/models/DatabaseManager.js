import fs from "fs";
import path from "path";
import logger from "../utils/logger.js";

class DatabaseManager {
    constructor(databasePath = "./database") {
        this.databasePath = databasePath;
        this.ensureDatabaseDir();
        this.cache = new Map();
    }

    ensureDatabaseDir() {
        if (!fs.existsSync(this.databasePath)) {
            fs.mkdirSync(this.databasePath, { recursive: true });
        }
    }

    getFilePath(filename) {
        return path.join(this.databasePath, `${filename}.json`);
    }

    load(filename, defaultValue = []) {
        try {
            const filePath = this.getFilePath(filename);
            
            if (this.cache.has(filename)) {
                return this.cache.get(filename);
            }

            if (!fs.existsSync(filePath)) {
                this.save(filename, defaultValue);
                return defaultValue;
            }

            const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
            this.cache.set(filename, data);
            return data;
        } catch (error) {
            logger.error(`Failed to load database file: ${filename}`, error);
            return defaultValue;
        }
    }

    save(filename, data) {
        try {
            const filePath = this.getFilePath(filename);
            fs.writeFileSync(filePath, JSON.stringify(data, null, 3));
            this.cache.set(filename, data);
            return true;
        } catch (error) {
            logger.error(`Failed to save database file: ${filename}`, error);
            return false;
        }
    }

    reload(filename) {
        this.cache.delete(filename);
        return this.load(filename);
    }

    clearCache() {
        this.cache.clear();
    }

    // Specific database methods
    getAntilink() {
        return this.load('antilink', []);
    }

    getAntilink2() {
        return this.load('antilink2', []);
    }

    getWelcome() {
        return this.load('welcome', []);
    }

    getAfk() {
        return this.load('afk', []);
    }

    getList() {
        return this.load('list', []);
    }

    getTesti() {
        return this.load('list-testi', []);
    }

    getProduk() {
        return this.load('list-produk', []);
    }

    getSetDone() {
        return this.load('set_done', []);
    }

    getSetProses() {
        return this.load('set_proses', []);
    }

    getSewa() {
        return this.load('sewa', []);
    }

    getError() {
        return this.load('error', []);
    }

    // Save methods
    saveAntilink(data) {
        return this.save('antilink', data);
    }

    saveAntilink2(data) {
        return this.save('antilink2', data);
    }

    saveWelcome(data) {
        return this.save('welcome', data);
    }

    saveAfk(data) {
        return this.save('afk', data);
    }

    saveList(data) {
        return this.save('list', data);
    }

    saveTesti(data) {
        return this.save('list-testi', data);
    }

    saveProduk(data) {
        return this.save('list-produk', data);
    }

    saveSetDone(data) {
        return this.save('set_done', data);
    }

    saveSetProses(data) {
        return this.save('set_proses', data);
    }

    saveSewa(data) {
        return this.save('sewa', data);
    }

    saveError(data) {
        return this.save('error', data);
    }
}

export default DatabaseManager; 