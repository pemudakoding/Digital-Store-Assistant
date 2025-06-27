/**
 * Hot Reload System
 * Automatically reloads modules when files change during development
 */

import fs from 'fs';
import path from 'path';
import { color } from './console.js';

class HotReload {
    constructor() {
        this.watchers = new Map();
        this.isProduction = process.env.NODE_ENV === 'production';
        this.moduleCache = new Map();
    }

    /**
     * Clear module from cache
     * @param {string} modulePath - Module path to uncache
     * @returns {Promise<void>}
     */
    async uncache(modulePath) {
        return new Promise((resolve, reject) => {
            try {
                // For ES modules, we need to handle differently
                if (this.moduleCache.has(modulePath)) {
                    this.moduleCache.delete(modulePath);
                }
                resolve();
            } catch (e) {
                reject(e);
            }
        });
    }

    /**
     * Watch file for changes and reload on update
     * @param {string} modulePath - Module path to watch
     * @param {Function} callback - Callback function on reload
     */
    watch(modulePath, callback = () => {}) {
        if (this.isProduction) {
            // Skip hot reload in production
            return;
        }

        try {
            const baseName = path.basename(modulePath);
            
            console.log(color(`[HOT-RELOAD] Watching ${baseName}`, 'cyan'));
            
            // Clear existing watcher if exists
            if (this.watchers.has(modulePath)) {
                this.watchers.get(modulePath).close();
            }

            // Create new file watcher
            const watcher = fs.watchFile(modulePath, async () => {
                try {
                    await this.uncache(modulePath);
                    callback(modulePath);
                    console.log(color(`[HOT-RELOAD] ${baseName} has been updated!`, 'green'));
                } catch (error) {
                    console.error(color(`[HOT-RELOAD] Error reloading ${baseName}:`, 'red'), error);
                }
            });

            this.watchers.set(modulePath, watcher);
        } catch (error) {
            console.error(color(`[HOT-RELOAD] Error watching ${modulePath}:`, 'red'), error);
        }
    }

    /**
     * Watch multiple modules
     * @param {Array} modules - Array of module paths
     * @param {Function} callback - Callback function on reload
     */
    watchMultiple(modules, callback = () => {}) {
        modules.forEach(module => {
            this.watch(module, callback);
        });
    }

    /**
     * Stop watching a specific module
     * @param {string} modulePath - Module path to stop watching
     */
    unwatch(modulePath) {
        try {
            if (this.watchers.has(modulePath)) {
                this.watchers.get(modulePath).close();
                this.watchers.delete(modulePath);
                console.log(color(`[HOT-RELOAD] Stopped watching ${path.basename(modulePath)}`, 'yellow'));
            }
        } catch (error) {
            console.error(color(`[HOT-RELOAD] Error unwatching ${modulePath}:`, 'red'), error);
        }
    }

    /**
     * Stop watching all modules
     */
    unwatchAll() {
        this.watchers.forEach((watcher, path) => {
            watcher.close();
            console.log(color(`[HOT-RELOAD] Stopped watching ${path}`, 'yellow'));
        });
        this.watchers.clear();
    }

    /**
     * Initialize hot reload for main bot files
     */
    initBotHotReload() {
        if (this.isProduction) return;

        const watchList = [
            '../index.js',
            '../main.js',
            './common.js'
        ];

        console.log(color('[HOT-RELOAD] Initializing hot reload system...', 'cyan'));
        
        watchList.forEach(modulePath => {
            try {
                this.watch(modulePath);
            } catch (error) {
                console.warn(color(`[HOT-RELOAD] Could not watch ${modulePath}`, 'yellow'));
            }
        });
    }
}

// Create singleton instance
const hotReload = new HotReload();

export default hotReload; 