/**
 * Legacy Compatibility Layer
 * Provides backward compatibility with old lib structure
 * @deprecated Use direct imports from src/ instead
 */

import lib from "./index.js";

// Legacy exports for backward compatibility
export default {
    // From old myfunc.js
    serialize: lib.messageSerializer.serialize,
    getRandom: lib.common.getRandom,
    getBuffer: lib.common.getBuffer,
    fetchJson: lib.common.fetchJson,
    getGroupAdmins: lib.common.getGroupAdmins,
    runtime: lib.common.runtime,
    sleep: lib.common.sleep,
    reSize: lib.common.reSize,
    makeid: lib.common.makeId,
    isUrl: lib.common.isUrl,

    // From old queue.js
    queue: lib.queue.queue,
    queueUpsertChat: lib.queue.queueUpsertChat,

    // From old console.js
    color: lib.console.color,
    bgcolor: lib.console.bgcolor,
    pickRandom: lib.common.pickRandom,
    randomNomor: lib.common.randomNumber,

    // From old Upload_Url.js
    imageToWebp: lib.mediaService.imageToWebp.bind(lib.mediaService),
    videoToWebp: lib.mediaService.videoToWebp.bind(lib.mediaService),
    writeExifImg: lib.mediaService.writeExifImg.bind(lib.mediaService),
    writeExifVid: lib.mediaService.writeExifVid.bind(lib.mediaService),
    writeExif: lib.mediaService.writeExif.bind(lib.mediaService),
    UploadFileUgu: lib.mediaService.uploadFile.bind(lib.mediaService), // Updated to new method name

    // From old scraper2.js
    Tiktok: lib.scraperService.downloadTikTok.bind(lib.scraperService),
    remini: lib.scraperService.enhanceImage.bind(lib.scraperService),

    // From old all-function.js - List functions
    addResponList: lib.listManager.addResponList.bind(lib.listManager),
    getDataResponList: lib.listManager.getDataResponList.bind(lib.listManager),
    isAlreadyResponList: lib.listManager.isAlreadyResponList.bind(lib.listManager),
    sendResponList: lib.listManager.sendResponList.bind(lib.listManager),
    isAlreadyResponListGroup: lib.listManager.isAlreadyResponListGroup.bind(lib.listManager),
    delResponList: lib.listManager.delResponList.bind(lib.listManager),
    updateResponList: lib.listManager.updateResponList.bind(lib.listManager),
    updateResponListKey: lib.listManager.updateResponListKey.bind(lib.listManager),
    updateListStatus: lib.listManager.updateListStatus.bind(lib.listManager),

    // From old all-function.js - Testimonial functions
    addResponTesti: lib.testiManager.addResponTesti.bind(lib.testiManager),
    getDataResponTesti: lib.testiManager.getDataResponTesti.bind(lib.testiManager),
    isAlreadyResponTesti: lib.testiManager.isAlreadyResponTesti.bind(lib.testiManager),
    sendResponTesti: lib.testiManager.sendResponTesti.bind(lib.testiManager),
    resetTestiAll: lib.testiManager.resetTestiAll.bind(lib.testiManager),
    delResponTesti: lib.testiManager.delResponTesti.bind(lib.testiManager),
    updateResponTesti: lib.testiManager.updateResponTesti.bind(lib.testiManager),

    // From old all-function.js - AFK functions
    addAfk: lib.afkManager.addAfk.bind(lib.afkManager),
    removeAfk: lib.afkManager.removeAfk.bind(lib.afkManager),
    isAfk: lib.afkManager.isAfk.bind(lib.afkManager),
    getAfkUsers: lib.afkManager.getAfkUsers.bind(lib.afkManager),
    getDbAfk: lib.afkManager.getDbAfk.bind(lib.afkManager),

    // From old all-function.js - Sewa functions
    addSewaGroup: lib.sewaManager.addSewaGroup.bind(lib.sewaManager),
    expiredCheck: lib.sewaManager.expiredCheck.bind(lib.sewaManager),
    getSewaPosition: lib.sewaManager.getSewaPosition.bind(lib.sewaManager),
    getSewaExpired: lib.sewaManager.getSewaExpired.bind(lib.sewaManager),
    checkSewaGroup: lib.sewaManager.checkSewaGroup.bind(lib.sewaManager),

    // From old chache.js
    nocache: lib.hotReload.watch.bind(lib.hotReload),
    uncache: lib.hotReload.uncache.bind(lib.hotReload),

    // From old module.js - Not needed anymore as we use direct requires
    modul: {
        fs: require('fs'),
        baileys: require('@adiwajshing/baileys'), 
        boom: require('@hapi/boom'),
        chalk: require('chalk'),
        path: require('path'),
        process: require('process'),
    }
}; 