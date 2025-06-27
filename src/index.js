/**
 * KoalaStore Bot Library Entry Point
 * Clean and organized exports for all refactored modules
 */

// Utils
import queue from './utils/queue.js';
import common from './utils/common.js';
import console from './utils/console.js';
import hotReload from './utils/hotReload.js';
import messageSerializer from './utils/messageSerializer.js';

// Services
import MediaService from './services/MediaService.js';
import ScraperService from './services/ScraperService.js';

// Models
import ListManager from './models/ListManager.js';
import TestiManager from './models/TestiManager.js';
import AfkManager from './models/AfkManager.js';
import SewaManager from './models/SewaManager.js';

// Create service instances
const mediaService = new MediaService();
const scraperService = new ScraperService();

// Create model instances
const listManager = new ListManager();
const testiManager = new TestiManager();
const afkManager = new AfkManager();
const sewaManager = new SewaManager();

export {
    // Utils
    queue,
    common,
    console,
    hotReload,
    messageSerializer,
    
    // Services
    MediaService,
    ScraperService,
    mediaService,
    scraperService,
    
    // Models
    ListManager,
    TestiManager,
    AfkManager,
    SewaManager,
    listManager,
    testiManager,
    afkManager,
    sewaManager
};

export default {
    // Utils
    queue,
    common,
    console,
    hotReload,
    messageSerializer,
    
    // Services
    MediaService,
    ScraperService,
    mediaService,
    scraperService,
    
    // Models
    ListManager,
    TestiManager,
    AfkManager,
    SewaManager,
    listManager,
    testiManager,
    afkManager,
    sewaManager
}; 