import chalk from "chalk";
import fs from "fs";
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Environment variables with fallbacks
const config = {
    bot: {
        ownerNumber: process.env.OWNER_NUMBER || "6285155429967@s.whatsapp.net",
        kontakOwner: process.env.CONTACT_OWNER || "6285155429967",
        namaStore: process.env.STORE_NAME || "KOALASTORE.DIGI",
        botName: process.env.BOT_NAME || "KOALA ASSISTANT",
        ownerName: process.env.OWNER_NAME || "STIVEN TRIZKY KATUUK",
        usePairingCode: process.env.USE_PAIRING_CODE === 'true' || false,
        port: process.env.PORT || 3000
    },
    links: {
        youtube: process.env.YOUTUBE_LINK || "link chanel yt lu",
        instagram: process.env.INSTAGRAM_LINK || "link akun ig lu",
        groupLink1: process.env.GROUP_LINK_1 || "Link grup WhatsApp mu (1)",
        groupLink2: process.env.GROUP_LINK_2 || "Link grup WhatsApp mu (2)"
    },

    paths: {
        database: "./database",
        media: "./gambar",
        session: "./sessionn"
    }
};

// Set global variables for backward compatibility
global.ownerNumber = config.bot.ownerNumber;
global.kontakOwner = config.bot.kontakOwner;
global.namaStore = config.bot.namaStore;
global.botName = config.bot.botName;
global.ownerName = config.bot.ownerName;
global.linkyt = config.links.youtube;
global.linkig = config.links.instagram;

global.linkgc1 = config.links.groupLink1;
global.linkgc2 = config.links.groupLink2;

// Hot reload configuration (modified for ES modules)
fs.watchFile(__filename, () => {
    fs.unwatchFile(__filename);
    console.log(chalk.redBright(`Updated '${__filename}'`));
    // ES modules don't have require.cache, so just log the update
});

export default config; 