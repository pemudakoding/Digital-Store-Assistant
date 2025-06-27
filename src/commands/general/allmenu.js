/**
 * All Menu command - Display complete menu
 */
async function allmenuCommand(context) {
    const { messageService, from, msg } = context;
    
    try {
        const menu = `
───「 *⭐ALL MENU⭐* 」───


┏           『 𝙈𝙖𝙞𝙣 𝙈𝙚𝙣𝙪 』           ◧

⭔ ffstalk
⭔ mlstalk
⭔ tiktok
⭔ tiktokaudio
⭔ produk
⭔ listproduk
⭔ donasi
⭔ ping
⭔ test
⭔ payment
⭔ pembayaran
⭔ script
⭔ sticker

┗━◧


┏           『 𝙂𝙧𝙤𝙪𝙥 𝙈𝙚𝙣𝙪 』           ◧

⭔ ceksewa
⭔ hidetag
⭔ group open
⭔ group close
⭔ antilink (kick)
⭔ antilink2 (no kick)
⭔ welcome on
⭔ welcome off
⭔ kick
⭔ proses
⭔ done
⭔ setdone
⭔ delsetdone
⭔ setproses
⭔ delsetproses
⭔ linkgc
⭔ tagall
⭔ fitnah
⭔ revoke
⭔ delete

⭔ addlist (Support image)
⭔ dellist
⭔ list
⭔ shop
⭔ hapuslist
⭔ open keyproduk
⭔ close keyproduk
⭔ afk alasan

┗━◧


┏    『 *PROSES/DONE MENU* 』    ◧

⭔ proses
⭔ done
⭔ setdone
⭔ delsetdone
⭔ changedone
⭔ setproses
⭔ delsetproses
⭔ changeproses

┗━◧


┏           『 𝙊𝙬𝙣𝙚𝙧 𝙈𝙚𝙣𝙪 』           ◧

⭔ mode (on/off)
⭔ addsewa
⭔ delsewa
⭔ listsewa
⭔ gantiqris
⭔ addtesti
⭔ deltesti
⭔ addproduk
⭔ delproduk
⭔ join
⭔ sendbyr 62xxx
⭔ block 62xxx
⭔ unblock 62xxx

┗━◧


┏           『 *Kalkulator* 』           ◧

⭔ tambah
⭔ kali
⭔ bagi
⭔ kurang

┗━◧


┏   『 *SOSIAL MEDIA* 』        ◧

⭔ ig
⭔ yt
⭔ gc
⭔ youtube
⭔ Instagram
⭔ groupadmin

┗━━━━━━━━━━━━━━━━━━◧
`;

        await messageService.reply(from, menu, msg);
        
    } catch (error) {
        await messageService.sendError(from, 'general', msg);
    }
}

export default allmenuCommand; 