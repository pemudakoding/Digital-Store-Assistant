# ❓ Frequently Asked Questions (FAQ)

Kumpulan pertanyaan yang sering diajukan tentang KoalaStore WhatsApp Bot.

## 🚀 Getting Started

### Q: Apakah bot ini gratis?
**A:** Ya, KoalaStore Bot adalah open-source dan gratis digunakan. Anda hanya perlu menyediakan server untuk hosting.

### Q: Apakah perlu coding untuk menggunakan bot ini?
**A:** Tidak perlu coding untuk penggunaan dasar. Cukup install, konfigurasi, dan jalankan. Coding diperlukan hanya jika ingin menambah fitur custom.

### Q: Berapa lama waktu setup?
**A:** Setup dasar bisa selesai dalam 5-10 menit. Setup production lengkap sekitar 30-60 menit.

### Q: Apakah bisa running di Windows?
**A:** Ya, bot mendukung Windows, macOS, dan Linux. Tapi Linux lebih direkomendasikan untuk production.

## 🔧 Technical Questions

### Q: WhatsApp versi berapa yang didukung?
**A:** Bot menggunakan WhatsApp Web API melalui library Baileys, sehingga kompatibel dengan semua versi WhatsApp yang mendukung WhatsApp Web.

### Q: Apakah bot bisa banned oleh WhatsApp?
**A:** Risk ada tapi minimal jika digunakan dengan wajar. Hindari spam dan ikuti rate limiting. Gunakan nomor terpisah untuk bot jika khawatir.

### Q: Berapa maksimal grup yang bisa dihandle?
**A:** Secara teknis tidak ada limit, tapi performa akan bergantung pada spesifikasi server. Sudah ditest hingga 1000+ grup.

### Q: Database apa yang digunakan?
**A:** Default menggunakan file JSON untuk simplicity. Bisa diganti ke SQL/NoSQL database untuk scale yang lebih besar.

### Q: Apakah ada API untuk integrasi external?
**A:** Belum ada REST API built-in, tapi mudah ditambahkan. Lihat roadmap untuk development API endpoints.

## 🏪 Store Management

### Q: Apakah bisa untuk multiple store?
**A:** Ya, satu bot bisa manage multiple grup dengan produk berbeda per grup. Owner bisa manage semua store dari satu tempat.

### Q: Bagaimana cara track sales?
**A:** Saat ini tracking manual melalui log files. Fitur analytics dashboard sedang dalam development.

### Q: Apakah support payment gateway?
**A:** Saat ini hanya menampilkan info pembayaran. Direct payment integration sedang dalam roadmap.

### Q: Bisa auto-confirm payment?
**A:** Tidak, konfirmasi payment masih manual untuk security. Auto-confirmation beresiko fraud.

### Q: Bagaimana backup data store?
**A:** Data tersimpan di folder `database/` dalam format JSON. Cukup backup folder tersebut secara berkala.

## 🔐 Security & Privacy

### Q: Apakah data customer aman?
**A:** Bot tidak menyimpan data personal customer. Hanya menyimpan data yang diperlukan untuk operasi store (product lists, testimonials).

### Q: Bagaimana mengamankan bot dari abuse?
**A:** Bot memiliki permission system, rate limiting, dan anti-spam protection. Admin dapat kick user yang abuse.

### Q: Apakah conversation log disimpan?
**A:** Tidak, conversation tidak disimpan. Hanya log sistem dan error yang dicatat untuk debugging.

### Q: Bagaimana jika WhatsApp account di-hack?
**A:** Segera logout bot (`logout` command), ganti password WhatsApp, dan clear session data.

## 🎮 Features & Commands

### Q: Berapa banyak command yang tersedia?
**A:** 50+ built-in commands. List lengkap ada di [Commands Guide](.docs/07-commands.md).

### Q: Bisa tambah command custom?
**A:** Ya! Lihat [Creating Commands Guide](.docs/11-creating-commands.md) untuk cara membuat command baru.

### Q: Apakah mendukung multimedia?
**A:** Ya, mendukung gambar, video, audio, dan sticker. Ada built-in sticker maker juga.

### Q: Bisa automate social media posting?
**A:** Tidak built-in, tapi bisa ditambahkan custom integration dengan platform social media.

### Q: Ada fitur scheduler untuk posting?
**A:** Belum ada built-in scheduler. Bisa menggunakan cron job external atau tambah fitur custom.

## 🖥️ Hosting & Deployment

### Q: Spesifikasi server minimum?
**A:** 
- **RAM:** 512MB (1GB recommended)
- **CPU:** 1 core (2 cores recommended)  
- **Storage:** 1GB
- **Bandwidth:** Unlimited preferred

### Q: Hosting provider mana yang recommended?
**A:** VPS dengan uptime tinggi seperti DigitalOcean, Vultr, atau AWS. Avoid shared hosting.

### Q: Bisa running di shared hosting?
**A:** Sangat tidak disarankan. Bot perlu persistent connection dan root access yang tidak tersedia di shared hosting.

### Q: Bagaimana cara auto-restart jika crash?
**A:** Gunakan PM2 process manager:
```bash
pm2 start src/app.js --name koalastore-bot
pm2 startup
pm2 save
```

### Q: Apakah perlu domain name?
**A:** Tidak wajib untuk bot functionality, tapi berguna untuk webhook dan web dashboard (future feature).

### Q: SSL certificate diperlukan?
**A:** Tidak untuk basic bot operation. Diperlukan hanya jika menambah web interface.

## 🔄 Updates & Maintenance

### Q: Seberapa sering ada update?
**A:** Update minor biasanya bulanan, update major 3-6 bulan sekali. Follow GitHub releases untuk notifikasi.

### Q: Bagaimana cara update bot?
**A:** 
```bash
git pull origin main
npm install
pm2 restart koalastore-bot
```

### Q: Apakah update akan break existing setup?
**A:** Kami usahakan backward compatibility. Breaking changes akan ada di major version update dengan migration guide.

### Q: Bagaimana backup sebelum update?
**A:** 
```bash
cp -r database/ backup_$(date +%Y%m%d)/
git tag backup-$(date +%Y%m%d)
```

### Q: Rolling back jika update bermasalah?
**A:** 
```bash
git checkout previous-tag
npm install
pm2 restart koalastore-bot
```

## 🤝 Community & Support

### Q: Dimana bisa minta bantuan?
**A:** 
1. **GitHub Issues** - Bug reports dan feature requests
2. **Discord/Telegram** - Real-time community support
3. **Documentation** - Comprehensive guides
4. **Email** - Direct support untuk urgent issues

### Q: Bagaimana cara contribute ke project?
**A:** Lihat [Contributing Guide](.docs/10-contributing.md) untuk panduan lengkap.

### Q: Apakah ada komunitas pengguna?
**A:** Ya! Join Discord/Telegram group untuk diskusi, tips, dan troubleshooting bersama.

### Q: Bisa request fitur baru?
**A:** Tentu! Buat feature request di GitHub Issues atau diskusikan di community channels.

### Q: Apakah ada documentation untuk developer?
**A:** Ya, complete documentation tersedia di folder `.docs/` dengan API reference dan architecture guides.

## 💰 Commercial Use

### Q: Boleh digunakan untuk bisnis komersial?
**A:** Ya, MIT license memperbolehkan penggunaan komersial tanpa royalty.

### Q: Apakah perlu mention credit?
**A:** Tidak wajib, tapi sangat appreciated jika mention credit ke project ini.

### Q: Bisa jual service setup bot ke client?
**A:** Ya, boleh jual service setup/maintenance bot. Tapi tidak boleh jual source code sebagai proprietary.

### Q: Ada support berbayar?
**A:** Saat ini belum ada official paid support. Community support gratis tersedia.

### Q: Bisa white-label untuk client?
**A:** Ya, bisa customize branding sesuai kebutuhan client.

## 🔮 Future Plans

### Q: Apa roadmap untuk 6 bulan ke depan?
**A:**
- **v2.1.0:** Web dashboard dan analytics
- **v2.2.0:** Payment gateway integration  
- **v2.3.0:** Multi-language support
- **v3.0.0:** AI integration dan advanced features

### Q: Kapan akan ada web dashboard?
**A:** Target Q2 2024. Progress bisa diikuti di GitHub Projects.

### Q: Apakah akan support platform chat lain?
**A:** Fokus saat ini di WhatsApp. Platform lain mungkin dipertimbangkan di future major version.

### Q: AI integration seperti apa yang direncanakan?
**A:** 
- Smart auto-responses
- Customer sentiment analysis
- Automated customer service
- Product recommendation engine

## 🐛 Troubleshooting

### Q: Bot tidak respond setelah install?
**A:** Check:
1. WhatsApp connection status
2. Permission settings
3. Log files untuk error messages
4. [Troubleshooting Guide](.docs/14-troubleshooting.md)

### Q: Command tidak jalan di grup tertentu?
**A:** Verify:
1. User permission level
2. Group admin settings
3. Bot admin status di grup
4. Command syntax

### Q: File database corrupt?
**A:** 
```bash
# Backup dulu
cp database/list.json database/list.json.backup

# Validate JSON
cat database/list.json | jq .

# Reset jika perlu
echo "[]" > database/list.json
```

### Q: Memory usage tinggi?
**A:** 
1. Restart bot secara berkala
2. Clean old log files
3. Optimize database queries
4. Monitor untuk memory leaks

### Q: Connection sering putus?
**A:**
1. Check internet stability
2. Update Baileys library
3. Clear session data
4. Use different network/VPN

## 📱 Mobile Usage

### Q: Bisa manage bot dari mobile?
**A:** Ya, semua command bisa dijalankan dari WhatsApp mobile. Web dashboard akan memudahkan management dari browser.

### Q: Apakah ada mobile app khusus?
**A:** Belum ada. Focus saat ini di web dashboard. Mobile app mungkin dikembangkan di masa depan.

### Q: Touch-friendly commands?
**A:** Ya, commands didesain pendek dan mudah diketik di mobile dengan aliases yang mudah diingat.

## 🌍 International

### Q: Mendukung bahasa selain Indonesia?
**A:** Saat ini fokus di Bahasa Indonesia. Multi-language support dalam roadmap.

### Q: Bisa digunakan di negara lain?
**A:** Ya, bot bisa digunakan dimana saja selama WhatsApp available dan ada internet.

### Q: Format nomor internasional?
**A:** Gunakan format internasional tanpa "+" (contoh: 62812345678 untuk Indonesia).

### Q: Time zone support?
**A:** Menggunakan system timezone. Bisa dikonfigurasi sesuai kebutuhan.

---

## 🤔 Tidak Menemukan Jawaban?

Jika pertanyaan Anda tidak ada di FAQ ini:

1. **Search di [Documentation](.docs/README.md)**
2. **Check [GitHub Issues](https://github.com/yourusername/KoalaStore/issues)**
3. **Ask di community Discord/Telegram**
4. **Create new GitHub issue dengan label "question"**

---

**FAQ ini akan terus diupdate berdasarkan pertanyaan yang sering muncul. Contribute dengan menambah pertanyaan yang Anda rasa penting!** 🙏 