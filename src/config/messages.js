/**
 * Bot Messages Configuration
 * Contains all hardcoded messages used by the bot
 */
const messages = {
    wait: "_Wait a minute, data is being processed!_",
    
    errors: {
        invalidLink: "Link yang kamu berikan tidak valid",
        apiError: "Maaf terjadi kesalahan",
        general: "Terjadi kesalahan, silakan coba lagi"
    },
    
    restrictions: {
        groupOnly: "Perintah ini hanya bisa digunakan di grup",
        privateOnly: "Perintah ini hanya bisa digunakan di private message",
        adminOnly: "Perintah ini hanya bisa digunakan oleh Admin Grup",
        botAdminOnly: "Bot harus menjadi admin",
        ownerOnly: "Perintah ini hanya dapat digunakan oleh owner bot",
        premiumOnly: "Perintah ini khusus member premium\nMinat jadi premium? hubungi owner",
        userNotRegistered: "Maaf kak, kamu belum terdaftar di database bot, ketik #verify\nUntuk memverifikasi."
    },
    
    welcome: {
        promote: (name, groupName) => `*@${name} Naik jabatan jadi pejabat grup*`,
        demote: (name, groupName) => `*@${name} Turun jabatan menjadi rakyat jelata*`,
        join: (name, groupName) => `*Welcome To ${groupName}* @${name}\nKetik *list* untuk lihat daftar menu yang tersedia!\nKetik *payment* untuk pembayaran!`,
        leave: (name, groupName) => `*SAMPAI JUMPA* 👋 @${name}\nTerima kasih telah bergabung dengan ${groupName}`
    },
    
    buttons: {
        welcome: "Welcome👋",
        congratulations: "Selamat🎉",
        goodbye: "Bye👋"
    }
};

export default messages; 