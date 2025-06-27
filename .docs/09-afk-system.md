# 🌙 Sistem AFK (Away From Keyboard) - Per Group Scope

Sistem AFK memungkinkan admin grup untuk menandai diri mereka sedang tidak ada di tempat **pada grup tertentu**. Bot akan secara otomatis memberitahu member lain ketika admin yang sedang AFK di-mention atau di-reply **hanya di grup tersebut**.

## 📋 Fitur Utama

### ✨ Auto Detection
- **Mention Detection**: Bot mendeteksi ketika admin AFK di-mention
- **Reply Detection**: Bot mendeteksi ketika pesan admin AFK di-reply
- **Multiple Mentions**: Bot dapat handle beberapa mention sekaligus
- **Auto Return**: Otomatis menghapus status AFK ketika admin mengirim pesan

### 🎭 Smart Responses
- **Variasi Pesan**: Bot menggunakan berbagai template pesan yang menarik
- **Duration Display**: Menampilkan berapa lama admin sudah AFK
- **Reason Display**: Menampilkan alasan AFK yang diberikan admin
- **Random Messages**: Pesan notifikasi dan return bervariasi

## 🚀 Commands

### `/afk [alasan]`
**Deskripsi**: Set status AFK untuk admin grup
**Akses**: Admin grup only
**Lokasi**: Grup only

**Contoh Penggunaan**:
```
/afk sholat jumat
/afk meeting dengan client
/afk istirahat sebentar
/afk
```

**Response Examples**:
- 🌙 *Admin* sekarang sedang AFK
  💭 **Alasan:** sholat jumat
  
  _Bot akan memberitahu yang mention/reply kamu! 🤖_

- 😴 *Admin* telah pergi sementara...
  💬 **Alasan:** meeting dengan client
  
  _Jangan lupa kembali ya! 👋_

### `/cekafk`
**Deskripsi**: Cek daftar admin yang sedang AFK
**Akses**: Semua member grup
**Lokasi**: Grup only

**Contoh Response**:
```
🌙 DAFTAR ADMIN AFK

1. Admin Store
   💭 sholat jumat
   ⏰ 15 menit

2. Admin Support  
   💭 meeting dengan client
   ⏰ 1 jam 30 menit

Total: 2 admin sedang AFK
```

### `/unafk`
**Deskripsi**: Hapus status AFK user lain (Admin only)
**Akses**: Admin grup only
**Lokasi**: Grup only

**Cara Penggunaan**:
1. Reply pesan user AFK + ketik `/unafk`
2. Mention user + `/unafk @username`

**Contoh Response**:
```
✅ Admin Store telah dihapus dari status AFK!
💭 Alasan sebelumnya: sholat jumat  
⏰ Durasi AFK: 15 menit

Dipaksa balik sama admin! 😄
```

## 🔧 Cara Kerja System

### 1. Set AFK Status
1. Admin ketik command `/afk [alasan]`
2. Bot validasi user adalah admin grup
3. Bot simpan data ke database AFK
4. Bot kirim konfirmasi dengan pesan acak

### 2. AFK Detection
1. Bot monitor setiap pesan di grup
2. Extract mentions dan replies dari pesan
3. Cek apakah user yang di-mention/reply sedang AFK
4. Kirim notifikasi AFK dengan info lengkap

### 3. Auto Return
1. Bot deteksi ketika user AFK mengirim pesan
2. Otomatis hapus dari database AFK
3. Hitung durasi AFK
4. Kirim pesan return dengan info durasi

## 📊 Database Structure

**File**: `database/afk.json`

```json
[
   {
      "id": "6283877442467@s.whatsapp.net",
      "reason": "sholat jumat", 
      "pushname": "Admin Store",
      "timeStamp": 1750995958138
   }
]
```

**Field Descriptions**:
- `id`: WhatsApp user ID
- `reason`: Alasan AFK yang diberikan user
- `pushname`: Nama display user
- `timeStamp`: Waktu ketika set AFK (milliseconds)

## 🎨 Message Templates

### AFK Notification Templates
Sistem menggunakan 5 template acak untuk notifikasi AFK:

1. 🌙 *{name}* sedang AFK nih...
2. 😴 *{name}* lagi tidak ada di tempat  
3. 🚶‍♂️ *{name}* sedang menghilang...
4. 🎭 *{name}* sedang dalam mode ninja
5. 🌸 *{name}* sedang berkelana...

### Return Message Templates
Sistem menggunakan 5 template acak untuk pesan kembali:

1. 🎉 *{name}* udah balik nih! Welcome back, admin! 👋
2. ✨ *{name}* telah kembali dari petualangan! Selamat datang kembali! 🤗
3. 🌟 *{name}* sudah online lagi! Admin kesayangan sudah kembali! 💪
4. 🎊 *{name}* has returned! Back in action! 🔥
5. 🦋 *{name}* sudah selesai {reason}! Mari lanjutkan aktivitas! 🚀

## ⚡ Advanced Features

### Multiple Mention Handling
```javascript
// Bot dapat handle pesan seperti:
@admin1 @admin2 @admin3 ada yang bisa bantu?

// Response jika admin1 dan admin3 AFK:
🌙 Beberapa admin sedang AFK:

1. Admin Store
   💭 sholat jumat
   ⏰ 15 menit

2. Admin Support
   💭 meeting
   ⏰ 2 jam

Mohon tunggu hingga mereka kembali ya! 🙏
```

### Reply Detection
```javascript
// Bot deteksi reply ke pesan admin AFK
// dan otomatis kasih notifikasi
```

### Duration Calculation
Bot menghitung durasi AFK dengan format yang user-friendly:
- Detik: "30 detik"
- Menit: "15 menit" 
- Jam: "2 jam 30 menit"
- Hari: "1 hari 5 jam"

## 🛡️ Security & Validation

### Admin Only Commands
- Command `/afk` hanya bisa digunakan admin grup
- Command `/unafk` hanya bisa digunakan admin grup
- Validasi dilakukan di level MessageHandler

### Input Validation
- Reason AFK dibatasi panjang maksimal
- User ID validation
- Group context validation

### Error Handling
- Graceful error handling untuk semua operasi
- Logging untuk debugging
- User-friendly error messages

## 🔧 Configuration

### Customization Options
1. **Message Templates**: Edit template di `MessageHandler.js`
2. **Duration Format**: Customize di `calculateAfkDuration()`
3. **Access Control**: Modify di command files
4. **Database Path**: Configure di `AfkManager.js`

### Performance Settings
- Database operasi menggunakan sync I/O
- Message queue untuk prevent spam
- Memory-efficient data structure

## 📝 Usage Examples

### Scenario 1: Admin Set AFK
```
User: /afk meeting dengan client
Bot: 🌙 Admin Store sekarang sedang AFK
     💭 Alasan: meeting dengan client
     
     Bot akan memberitahu yang mention/reply kamu! 🤖
```

### Scenario 2: Someone Mention AFK Admin  
```
User: @admin_store bisa bantu order?
Bot: 😴 Admin Store lagi tidak ada di tempat
     💬 Alasan: meeting dengan client
     🕐 Sejak: 30 menit yang lalu
```

### Scenario 3: Admin Return
```
Admin: ok sudah selesai meeting
Bot: 🎉 Admin Store udah balik nih!
     💫 Tadi AFK: meeting dengan client
     ⏰ Lama pergi: 45 menit
     
     Welcome back, admin! 👋
```

## 🐛 Troubleshooting

### Common Issues

**Problem**: Command tidak response
**Solution**: 
- Pastikan user adalah admin grup
- Pastikan command digunakan di grup
- Check logs untuk error details

**Problem**: AFK tidak terdeteksi mention
**Solution**:
- Pastikan format mention benar (@username)
- Check MessageHandler logs
- Verify AfkManager database

**Problem**: Auto return tidak jalan
**Solution**:
- Check handleAfkAutoReturn function
- Verify user ID matching
- Check database write permissions

### Debug Commands
```javascript
// Check AFK database manually
console.log(afkManager.getDbAfk());

// Check specific user AFK status  
console.log(afkManager.getAfkUser(userId));

// Test duration calculation
console.log(afkManager.getAfkDuration(userId));
```

## 🔄 Updates & Maintenance

### Regular Maintenance
1. Monitor database size growth
2. Clean up old AFK entries if needed
3. Update message templates seasonally
4. Review performance metrics

### Version History
- **v1.0**: Basic AFK functionality
- **v2.0**: Multiple mention handling
- **v2.1**: Reply detection feature
- **v2.2**: Advanced message templates

---

💡 **Tips**: 
- Gunakan alasan AFK yang jelas dan singkat
- Admin bisa langsung kirim pesan apa saja untuk kembali dari AFK
- Command `cekafk` berguna untuk monitoring admin availability
- System ini membantu customer service yang lebih baik 