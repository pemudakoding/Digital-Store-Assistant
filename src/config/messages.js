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
        promote: (name, groupName) => `🎉 *SELAMAT!* @${name} mendapat promosi jadi *ADMIN* 👑\n_Level up successful!_ ✨`,
        demote: (name, groupName) => `📉 @${name} kembali ke status *MEMBER* biasa\n_Back to basics!_ 🔄`,
        join: (name, groupName) => `🔥 *HAI KAWAN!* @${name} 🔥\n━━━━━━━━━━━━━━━━━━\n✨ Welcome to *${groupName}* ✨\n\n💫 *Quick Start:*\n📋 Ketik *list* → Lihat semua produk keren\n💳 Ketik *payment* → Info pembayaran\n\n_Let's shopping! 🛒_`,
        leave: (name, groupName) => `😢 *GOODBYE KAWAN!* 👋\n@${name} telah meninggalkan *${groupName}*\n\n_Semoga kita berjumpa lagi! Until next time! 💫_`
    },
    
    buttons: {
        welcome: "Welcome👋",
        congratulations: "Selamat🎉",
        goodbye: "Bye👋"
    }
};

export default messages; 