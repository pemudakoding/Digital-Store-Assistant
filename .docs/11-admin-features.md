# 👨‍💼 Admin Features

Panduan lengkap fitur administrasi dan moderasi grup untuk KoalaStore WhatsApp Bot.

## 🔐 Overview

Bot menyediakan berbagai fitur administrasi yang memungkinkan admin grup untuk mengelola komunitas dengan efektif. Fitur-fitur ini dirancang khusus untuk membantu moderasi grup dan memberikan experience terbaik untuk member.

## 🎯 Permission System

### Tingkatan Akses

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│     Owner       │───▶│     Admin       │───▶│     Public      │
│  (Full Access)  │    │ (Group Commands)│    │ (Basic Commands)│
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

#### 1. Owner (Bot Owner)
- Akses ke semua fitur
- Dapat menggunakan semua command admin
- Dapat mengelola bot secara global
- Diatur di `setting.js` → `ownerNumber`

#### 2. Admin (Group Admin)  
- Hanya admin grup WhatsApp
- Akses ke command administrasi grup
- Dapat mengelola list produk
- Dapat menggunakan fitur moderasi

#### 3. Public
- Member biasa grup
- Akses ke command umum saja
- Tidak bisa menggunakan command admin

### Cara Mengecek Permission

Bot akan otomatis mengecek permission berdasarkan:

```javascript
// Check jika user adalah owner bot
const isOwner = setting.ownerNumber.includes(user.id);

// Check jika user adalah admin grup (hanya di grup)
const isAdmin = isGroup && groupAdmins.includes(user.id);

// Kombinasi: admin atau owner
const hasAdminAccess = isAdmin || isOwner;
```

## 🛍️ Store Management Commands

### Product List Management

#### addlist - Menambah Produk ke List

**Syntax:** `addlist <nama>|<deskripsi>`

**Access:** Admin/Owner

**Description:** Menambahkan produk baru ke list grup.

**Example:**
```
addlist Netflix Premium|Akun Netflix Premium 1 Bulan - Rp 25.000

addlist Spotify|Akun Spotify Premium Individual 1 Bulan - Rp 15.000

addlist Office 365|Microsoft Office 365 Family - Rp 200.000/tahun
```

**Response:**
```
✅ *LIST BERHASIL DITAMBAHKAN*

📦 *Produk:* Netflix Premium
📝 *Deskripsi:* Akun Netflix Premium 1 Bulan - Rp 25.000

Use: *list* untuk melihat semua produk
```

#### dellist - Menghapus Produk dari List

**Syntax:** `dellist <nama_produk>`

**Access:** Admin/Owner

**Example:**
```
dellist Netflix Premium
```

#### updatelist - Update Produk di List

**Syntax:** `updatelist <nama>|<deskripsi_baru>`

**Access:** Admin/Owner

**Example:**
```
updatelist Netflix Premium|Akun Netflix Premium 1 Bulan - Rp 22.000 (DISC 12%)
```

### Order Processing

#### setproses - Set Template Pesan Proses

**Syntax:** `setproses <template_pesan>`

**Access:** Admin/Owner

**Description:** Mengatur template pesan ketika order sedang diproses.

**Example:**
```
setproses ⏳ *ORDER SEDANG DIPROSES*

Hai kak, orderannya sedang kami proses ya!

📦 Produk: {produk}
💰 Total: {harga}
⏰ Estimasi: 1-3 jam

Mohon ditunggu ya kak 🙏
Terima kasih sudah order di Koala Store! 💖
```

**Template Variables:**
- `{produk}` - Nama produk
- `{harga}` - Total harga
- `{customer}` - Nama customer

#### setdone - Set Template Pesan Selesai

**Syntax:** `setdone <template_pesan>`

**Access:** Admin/Owner

**Example:**
```
setdone ✅ *ORDER COMPLETED*

Yeay! Orderan kakak sudah selesai nih! 🎉

📦 Produk: {produk}
💰 Total: {harga}
📅 Selesai: {tanggal}

Terima kasih sudah belanja di Koala Store! 💖
Jangan lupa kasih testimoni ya kak 😊

Rate pengalaman belanja kakak: ⭐⭐⭐⭐⭐
```

#### proses - Kirim Pesan Order Diproses

**Syntax:** `proses` (reply ke pesan order customer)

**Access:** Admin/Owner

**Usage:**
1. Customer kirim pesan order
2. Admin reply pesan tersebut dengan `proses`
3. Bot akan kirim template pesan proses

#### done - Kirim Pesan Order Selesai

**Syntax:** `done` (reply ke pesan order customer)

**Access:** Admin/Owner

**Usage:**
1. Customer kirim pesan order
2. Admin reply pesan tersebut dengan `done`
3. Bot akan kirim template pesan selesai

## 👥 Group Management Commands

### Member Management

#### kick - Kick Member dari Grup

**Syntax:** `kick` (reply ke pesan member yang mau dikick)

**Access:** Admin/Owner

**Requirements:**
- Bot harus jadi admin grup
- User yang menggunakan command harus admin
- Target tidak boleh admin/owner grup

**Example:**
```
// Member kirim pesan spam
// Admin reply pesan tersebut dengan:
kick
```

**Response:**
```
✅ Member berhasil dikick dari grup

👤 User: @62812345xxxxx
⚠️ Alasan: Pelanggaran aturan grup
👨‍💼 Dikick oleh: @62819876xxxxx
```

#### tagall - Tag Semua Member

**Syntax:** `tagall <pesan>`

**Access:** Admin/Owner

**Description:** Mention semua member grup dengan pesan khusus.

**Example:**
```
tagall Jangan lupa follow Instagram @koalastore untuk update produk terbaru!
```

**Response:**
```
📢 *ANNOUNCEMENT*

Jangan lupa follow Instagram @koalastore untuk update produk terbaru!

@member1 @member2 @member3 @member4...
```

#### hidetag - Hidden Tag Semua Member

**Syntax:** `hidetag <pesan>`

**Access:** Admin/Owner

**Description:** Tag semua member tanpa menampilkan mention secara eksplisit.

**Example:**
```
hidetag Flash sale dimulai! Diskon 50% untuk semua produk hari ini saja!
```

### Group Settings

#### open - Buka Grup

**Syntax:** `open`

**Access:** Admin/Owner

**Description:** Mengubah setting grup menjadi terbuka (semua member bisa kirim pesan).

**Response:**
```
✅ *GRUP DIBUKA*

Sekarang semua member bisa mengirim pesan di grup ini.
```

#### close - Tutup Grup

**Syntax:** `close`

**Access:** Admin/Owner

**Description:** Mengubah setting grup menjadi tertutup (hanya admin yang bisa kirim pesan).

**Response:**
```
🔒 *GRUP DITUTUP*

Sekarang hanya admin yang bisa mengirim pesan di grup ini.
```

#### linkgrup - Dapatkan Link Grup

**Syntax:** `linkgrup`

**Access:** Admin/Owner

**Response:**
```
🔗 *LINK GRUP*

https://chat.whatsapp.com/xxxxxxxxxx

⚠️ Jangan share link ini sembarangan!
```

#### revoke - Reset Link Grup

**Syntax:** `revoke`

**Access:** Admin/Owner

**Description:** Membuat link grup baru dan menonaktifkan link lama.

**Response:**
```
🔄 *LINK GRUP DIRESET*

Link grup lama sudah tidak berlaku.
Link baru: https://chat.whatsapp.com/yyyyyyyyyy
```

## 🛡️ Security & Protection

### Anti-Link Protection

#### antilink - Toggle Anti-Link

**Syntax:** `antilink on/off`

**Access:** Admin/Owner

**Description:** Mengaktifkan/menonaktifkan proteksi anti-link otomatis.

**Example:**
```
antilink on   // Aktifkan anti-link
antilink off  // Matikan anti-link
```

**Features:**
- Otomatis detect link WhatsApp grup lain
- Otomatis kick member yang kirim link
- Warning sebelum kick
- Whitelist untuk admin/owner

**Response saat aktif:**
```
🛡️ *ANTI-LINK ACTIVATED*

✅ Anti-link protection telah diaktifkan
⚠️ Member yang mengirim link grup lain akan otomatis dikick
🔒 Admin/Owner dikecualikan dari aturan ini
```

#### antilink2 - Anti-Link Mode Strict

**Syntax:** `antilink2 on/off`

**Access:** Admin/Owner

**Description:** Mode anti-link yang lebih ketat (block semua jenis link).

**Features:**
- Block semua jenis link (tidak hanya WA grup)
- Include: http, https, bit.ly, tinyurl, dll
- Warning + delete message

### Welcome System

#### welcome - Toggle Welcome Message

**Syntax:** `welcome on/off`

**Access:** Admin/Owner

**Description:** Mengaktifkan/menonaktifkan pesan welcome otomatis.

**Example:**
```
welcome on    // Aktifkan welcome
welcome off   // Matikan welcome
```

**Default Welcome Message:**
```
👋 *SELAMAT DATANG!*

Hai @newmember! 
Selamat datang di *Koala Store* 🐨

📋 Silakan baca rules grup
🛍️ Ketik *list* untuk melihat produk
💬 Tanya admin jika ada pertanyaan

Selamat berbelanja! 💖
```

## 🔧 Administrative Utilities

### Template Management

#### delsetproses - Hapus Template Proses

**Syntax:** `delsetproses`

**Access:** Admin/Owner

**Description:** Menghapus template pesan proses yang tersimpan.

#### delsetdone - Hapus Template Done

**Syntax:** `delsetdone`

**Access:** Admin/Owner

**Description:** Menghapus template pesan selesai yang tersimpan.

#### changeproses - Ubah Template Proses

**Syntax:** `changeproses <template_baru>`

**Access:** Admin/Owner

#### changedone - Ubah Template Done

**Syntax:** `changedone <template_baru>`

**Access:** Admin/Owner

### List Management

#### changelist - Ubah List Produk

**Syntax:** `changelist <nama>|<deskripsi_baru>`

**Access:** Admin/Owner

#### hapuslist - Alias untuk dellist

**Syntax:** `hapuslist <nama_produk>`

**Access:** Admin/Owner

## 🎭 Fun & Interaction

### fitnah - Generate Fake Chat

**Syntax:** `fitnah <nama>|<pesan>`

**Access:** Admin/Owner (entertainment purposes)

**Description:** Membuat screenshot chat palsu untuk hiburan.

**Example:**
```
fitnah Budi|Wah produk di Koala Store murah banget!
```

**⚠️ Warning:** Gunakan dengan bijak, hanya untuk hiburan!

## 📊 Group Analytics

### group - Info Grup

**Syntax:** `group`

**Access:** Admin/Owner

**Response:**
```
📊 *GROUP INFORMATION*

👥 *Nama:* Koala Store Official
🆔 *ID:* 1234567890@g.us
👤 *Members:* 156 orang
👨‍💼 *Admins:* 3 orang
📅 *Created:* 15 Januari 2024

🛡️ *Settings:*
├ Anti-link: ✅ Active
├ Welcome: ✅ Active  
└ Group Mode: 🔓 Open

📈 *Activity:*
├ Messages Today: 47
├ New Members: 2
└ Active Users: 23
```

## 🚀 Best Practices

### 1. Permission Management

```javascript
// ✅ Good: Proper permission check
if (!isAdmin && !isOwner) {
    return messageService.reply('Command ini hanya untuk admin!');
}

// ❌ Bad: No permission check
// Langsung eksekusi tanpa cek
```

### 2. Error Handling

```javascript
// ✅ Good: Handle errors gracefully
try {
    await groupService.kickMember(groupId, targetId);
    return messageService.reply('✅ Member berhasil dikick');
} catch (error) {
    console.error('Kick error:', error);
    return messageService.reply('❌ Gagal kick member. Bot mungkin bukan admin.');
}
```

### 3. User Feedback

```javascript
// ✅ Good: Clear feedback
return messageService.reply(`
✅ *PRODUK DITAMBAHKAN*

📦 Nama: ${productName}
💰 Harga: Rp ${price.toLocaleString()}
📝 Deskripsi: ${description}

Use: *list* untuk melihat semua produk
`);
```

### 4. Input Validation

```javascript
// ✅ Good: Validate input
if (!args.length || !args[0].includes('|')) {
    return messageService.reply(`
❌ *FORMAT SALAH*

Gunakan: addlist <nama>|<deskripsi>
Contoh: addlist Netflix|Akun Premium 1 Bulan - Rp 25.000
    `);
}
```

## 🔗 Integration dengan Store Management

Admin commands terintegrasi dengan sistem store:

```javascript
// Flow: addlist → listManager → database
addlist → ListManager.addList() → list-produk.json

// Flow: order processing
customer_order → admin_reply_proses → TemplateManager.getProses() → auto_response
```

## 📚 Related Documentation

- **[Commands Guide](./07-commands.md)** - Complete command reference
- **[Store Management](./08-store-management.md)** - Product & order management
- **[Project Structure](./04-project-structure.md)** - Code organization
- **[Creating Commands](./11-creating-commands.md)** - Build admin features

---

**👑 Pro Tips:**
- Gunakan template yang personal dan brand-friendly
- Monitor aktivitas grup secara berkala
- Backup data secara rutin
- Train admin baru dengan command dasar dulu 