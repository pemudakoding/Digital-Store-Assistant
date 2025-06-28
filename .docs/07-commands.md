# 🎮 Commands Guide

Panduan lengkap semua command yang tersedia di **KoalaStore Bot v2.0.0**. Commands diorganisir berdasarkan kategori dan level akses untuk kemudahan penggunaan.

## 📋 Command Categories

### 🌟 **General Commands** - Untuk semua user
### 👨‍💼 **Admin Commands** - Khusus admin grup  
### 👑 **Owner Commands** - Khusus owner bot
### 🛍️ **Store Commands** - Manajemen toko
### 🧮 **Calculator Commands** - Operasi matematika

---

## 🌟 General Commands

Commands yang bisa digunakan oleh semua user di private chat atau grup.

### 📖 Information & Help

| Command | Aliases | Description | Usage |
|---------|---------|-------------|-------|
| `help` | `koalaaa` | Menu bantuan lengkap | `help` |
| `allmenu` | - | Tampilkan semua kategori menu | `allmenu` |
| `ping` | - | Cek status bot dan latency | `ping` |
| `owner` | - | Info kontak owner | `owner` |
| `donasi` | `donate` | Info donasi dan support | `donasi` |
| `script` | - | Info script bot | `script` |

**Example:**
```
help
→ Menampilkan menu bantuan dengan kategorisasi command

ping  
→ 🏓 Pong! Response: 150ms
```

### 🎨 Media & Entertainment

| Command | Aliases | Description | Usage |
|---------|---------|-------------|-------|
| `sticker` | `s`, `stiker` | Convert gambar/video ke sticker | Reply media + `sticker` |
| `tiktok` | `tiktokowner` | Download video TikTok | `tiktok <url>` |
| `tiktokaudio` | `tiktokaudiobot` | Download audio TikTok | `tiktokaudio <url>` |

**Example:**
```
sticker
→ (Reply gambar/video untuk convert ke sticker)

tiktok https://tiktok.com/@user/video/123
→ Downloads TikTok video tanpa watermark
```

### 🎮 Gaming Tools

| Command | Aliases | Description | Usage |
|---------|---------|-------------|-------|
| `ffstalk` | - | Cek info player Free Fire | `ffstalk <player_id>` |
| `mlstalk` | - | Cek info player Mobile Legends | `mlstalk <player_id> <zone_id>` |

**Example:**
```
ffstalk 123456789
→ Menampilkan statistik player Free Fire

mlstalk 123456789 2345
→ Menampilkan info player Mobile Legends
```

### 😴 Utility

| Command | Aliases | Description | Usage | Restriction |
|---------|---------|-------------|-------|-------------|
| `afk` | - | Set status AFK | `afk [reason]` | Admin only, Group only |
| `ceksewa` | - | Cek status subscription | `ceksewa` | - |
| `previewlist` | `preview` | Preview produk dengan gambar | `previewlist <key>` | Group only |

**Example:**
```
afk Meeting important  
→ Set status AFK dengan alasan

ceksewa
→ Menampilkan status subscription aktif

previewlist netflix
→ [Displays Netflix product with image if available]
🔍 PREVIEW PRODUK
🏷️ Key: netflix
📝 Deskripsi: Netflix Premium 1 Bulan - Rp 25.000
✅ Status: TERSEDIA
🖼️ Gambar: Tersedia
```

---

## 👨‍💼 Admin Commands

Commands khusus untuk admin grup. Require admin permission di WhatsApp group.

### 📝 List Management

| Command | Description | Usage | Example |
|---------|-------------|-------|---------|
| `addlist` | Tambah item ke product list | `addlist <nama>\|<harga>` | `addlist Netflix\|25000` |
| `dellist` | Hapus item dari list | `dellist <nomor>` | `dellist 1` |
| `updatelist` | Update item existing | `updatelist <nomor>\|<nama>\|<harga>` | `updatelist 1\|Netflix Premium\|35000` |
| `changelist` | Edit item interaktif | `changelist <nomor>` | `changelist 1` |
| `removeimage` | Remove image from product | `removeimage <key>` | `removeimage netflix` |
| `hapuslist` | Hapus multiple items | `hapuslist` | `hapuslist` |

**Example Workflow:**
```
addlist Netflix|25000
→ ✅ List berhasil ditambahkan dengan ID: 1

dellist 1  
→ ✅ List dengan ID 1 berhasil dihapus

updatelist 1|Netflix Premium|35000
→ ✅ List ID 1 berhasil diupdate
```

### 📋 Order Processing

| Command | Description | Usage | Example |
|---------|-------------|-------|---------|
| `setproses` | Set template order processing | `setproses <template>` | `setproses Pesanan sedang diproses...` |
| `setdone` | Set template order completion | `setdone <template>` | `setdone Terima kasih sudah berbelanja!` |
| `proses` | Mark order sebagai processing | Reply pesan + `proses` | `proses` |
| `done` | Mark order sebagai complete | Reply pesan + `done` | `done` |
| `delsetproses` | Hapus template proses | `delsetproses` | `delsetproses` |
| `delsetdone` | Hapus template done | `delsetdone` | `delsetdone` |

**Example Workflow:**
```
setproses Pesanan Anda sedang kami proses, mohon tunggu ya!
→ ✅ Template proses berhasil diset

→ [Reply customer order message]
proses
→ Sends: "Pesanan Anda sedang kami proses, mohon tunggu ya!"

→ [Reply processed order message]  
done
→ Sends completion template message
```

### 👥 Group Management

| Command | Description | Usage | Example |
|---------|-------------|-------|---------|
| `tagall` | Tag semua member grup | `tagall <pesan>` | `tagall Pengumuman penting!` |
| `hidetag` | Tag semua tanpa mention visible | `hidetag <pesan>` | `hidetag Pesan rahasia` |
| `kick` | Kick member dari grup | `kick @user` atau reply | `kick @628123456789` |
| `group` | Info dan management grup | `group` | `group` |
| `open` | Buka grup untuk semua | `open` | `open` |
| `close` | Tutup grup untuk member | `close` | `close` |

**Example:**
```
tagall Ada event menarik hari ini!
→ @everyone Ada event menarik hari ini!

kick @628123456789
→ Member berhasil dikeluarkan dari grup

open
→ Grup telah dibuka untuk semua member
```

### 🔗 Group Settings

| Command | Description | Usage | Example |
|---------|-------------|-------|---------|
| `linkgrup` | Generate group invite link | `linkgrup` | `linkgrup` |
| `revoke` | Revoke group invite link | `revoke` | `revoke` |
| `welcome` | Set welcome message | `welcome <message>` | `welcome Selamat datang!` |

### 🛡️ Protection

| Command | Description | Usage | Example |
|---------|-------------|-------|---------|
| `antilink` | Toggle anti-link protection | `antilink <on/off>` | `antilink on` |
| `antilink2` | Advanced anti-link settings | `antilink2 <on/off>` | `antilink2 on` |

### 🗑️ Utilities

| Command | Description | Usage | Example |
|---------|-------------|-------|---------|
| `delete` | Delete bot message | Reply bot message + `delete` | `delete` |
| `fitnah` | Quote message faker | `fitnah <target>\|<message>` | `fitnah @user\|Hello world` |

---

## 👑 Owner Commands

Commands eksklusif untuk owner bot. Require owner permission.

### 📦 Product Management

| Command | Description | Usage | Example |
|---------|-------------|-------|---------|
| `addproduk` | Tambah produk ke catalog | `addproduk <nama>\|<harga>\|<deskripsi>` | `addproduk Netflix\|25000\|Akun Premium` |
| `delproduk` | Hapus produk dari catalog | `delproduk <nomor>` | `delproduk 1` |

### 💬 Testimonial Management

| Command | Description | Usage | Example |
|---------|-------------|-------|---------|
| `addtesti` | Tambah customer testimonial | `addtesti <customer>\|<rating>\|<komentar>` | `addtesti John\|⭐⭐⭐⭐⭐\|Bagus!` |
| `deltesti` | Hapus testimonial | `deltesti <nomor>` | `deltesti 1` |

### 🔄 Subscription Management

| Command | Description | Usage | Example |
|---------|-------------|-------|---------|
| `addsewa` | Tambah subscription service | `addsewa <service>\|<durasi>\|<harga>` | `addsewa Netflix\|30\|25000` |
| `delsewa` | Hapus subscription service | `delsewa <nomor>` | `delsewa 1` |
| `listsewa` | List semua subscription aktif | `listsewa` | `listsewa` |

### 📢 Communication

| Command | Description | Usage | Example |
|---------|-------------|-------|---------|
| `broadcast` | Broadcast ke semua chat | `broadcast <message>` | `broadcast Promo hari ini!` |
| `join` | Join grup via invite link | `join <link>` | `join https://chat.whatsapp.com/...` |

### ⚙️ Bot Management

| Command | Description | Usage | Example |
|---------|-------------|-------|---------|
| `mode` | Toggle public/private mode | `mode <public/private>` | `mode public` |
| `block` | Block user dari bot | `block @user` | `block @628123456789` |
| `unblock` | Unblock user | `unblock @user` | `unblock @628123456789` |
| `logout` | Logout dan clear session | `logout` | `logout` |
| `queuestats` | Message queue statistics | `queuestats` | `queuestats` |

### 🔧 Bot Management

| Command | Description | Usage | Example |
|---------|-------------|-------|---------|
| `botstat` | Bot status information | `botstat` | `botstat` |

**Owner Commands Workflow:**
```
addproduk Netflix Premium|35000|Akun Netflix Premium 1 bulan dengan garansi
→ ✅ Produk berhasil ditambahkan ke catalog

broadcast Flash Sale! Diskon 50% untuk semua produk!
→ Broadcasting to 50 chats...
→ ✅ Broadcast completed

mode private
→ ✅ Bot mode changed to private (hanya owner yang bisa menggunakan)
```

---

## 🛍️ Store Commands

Commands untuk menampilkan informasi toko dan produk.

| Command | Description | Restriction | Usage |
|---------|-------------|-------------|-------|
| `list` | Tampilkan daftar produk | Group only | `list` |
| `produk` | Tampilkan catalog produk | Private only | `produk` |
| `testi` | Tampilkan customer testimonials | Private only | `testi` |


**Example:**
```
list
→ 📋 DAFTAR PRODUK KOALA STORE
   1. Netflix Premium - Rp 25.000
   2. Spotify Premium - Rp 15.000
   
testi
→ 🌟 TESTIMONI CUSTOMER
   "Pelayanan cepat, produk berkualitas!" - Customer A
   "Recommended banget!" - Customer B
```

---

## 🧮 Calculator Commands

Commands untuk operasi matematika dasar.

| Command | Description | Usage | Example |
|---------|-------------|-------|---------|
| `tambah` | Penjumlahan | `tambah <angka1> <angka2>` | `tambah 10 5` |
| `kurang` | Pengurangan | `kurang <angka1> <angka2>` | `kurang 20 8` |
| `kali` | Perkalian | `kali <angka1> <angka2>` | `kali 7 6` |
| `bagi` | Pembagian | `bagi <angka1> <angka2>` | `bagi 15 3` |

**Example:**
```
tambah 25 17
→ 🧮 Hasil: 25 + 17 = 42

bagi 100 4  
→ 🧮 Hasil: 100 ÷ 4 = 25
```

---

## 🔐 Permission Levels

### 👤 **User (Public)**
- Dapat menggunakan semua General Commands
- Dapat menggunakan Store Commands
- Dapat menggunakan Calculator Commands

### 👨‍💼 **Admin (Group Admin)**
- Semua permission User
- Dapat menggunakan Admin Commands di grup
- Harus menjadi admin WhatsApp grup

### 👑 **Owner (Bot Owner)**
- Semua permission Admin
- Dapat menggunakan Owner Commands
- Dapat menggunakan bot di mode private
- Nomor terdaftar di `setting.js`

## 📱 Usage Context

### 💬 **Private Chat**
- Semua General Commands ✅
- Store Commands (kecuali `list`) ✅  
- Calculator Commands ✅
- Owner Commands (jika owner) ✅
- Admin Commands ❌

### 👥 **Group Chat**
- Semua General Commands ✅
- Store Commands (`list` only) ✅
- Calculator Commands ✅
- Admin Commands (jika admin) ✅
- Owner Commands (jika owner) ✅

## 🚀 Command Tips

### ✅ **Best Practices**

1. **Use exact syntax** - Commands case-sensitive
2. **Separate with |** - Untuk parameter multiple: `name|price|description`
3. **Reply for context** - Commands seperti `done`, `proses`, `delete`
4. **Check permissions** - Pastikan Anda punya akses yang tepat
5. **Use aliases** - `s` untuk `sticker`, `donate` untuk `donasi`

### ⚠️ **Common Issues**

```bash
# ❌ Wrong
addlist Netflix 25000        # Missing separator
sticker                      # No media replied

# ✅ Correct  
addlist Netflix|25000        # With separator
→ Reply image + sticker       # With media context
```

### 🔧 **Troubleshooting**

| Issue | Solution |
|-------|----------|
| Command tidak respond | Cek permission level & context (private/group) |
| "Command not found" | Pastikan spelling benar, cek aliases |
| "Only admin" error | Jadikan bot admin di grup WhatsApp |
| "Only owner" error | Pastikan nomor terdaftar di `setting.js` |

## 📊 Command Statistics

- **Total Commands**: 50+
- **General**: 13 commands
- **Admin**: 24 commands  
- **Owner**: 15 commands
- **Store**: 4 commands
- **Calculator**: 4 commands

---

**💡 Pro Tips:**
- Use `allmenu` untuk overview semua kategori
- Bookmark frequently used commands
- Join komunitas untuk tips penggunaan advanced
- Report bugs via GitHub Issues

**Next: [Store Management](./08-store-management.md) →** 

## 🖼️ Image Support Commands

Starting from v2.0.0, KoalaStore supports image management for products:

### Adding Products with Images

**Method 1: Send image with command**
```
[Send/attach image] + addlist netflix|Netflix Premium 1 Bulan - Rp 25.000
→ 📸 Sedang mengupload gambar...
→ ✅ Berhasil menambahkan produk NETFLIX ke dalam list!
   🖼️ Gambar: Berhasil diupload!
   🔗 URL: https://uguu.se/uploaded_image.jpg
```

**Method 2: Reply to image**
```
[Reply to any image]: addlist spotify|Spotify Premium - Rp 15.000
→ 📸 Sedang mengupload gambar dari reply...
→ ✅ Product added with image successfully!
```

### Updating Products with Images

```
[Send new image] + updatelist netflix|Netflix Premium Updated - Rp 30.000
→ 📸 Sedang mengupload gambar baru...
→ ✅ Berhasil update List NETFLIX
   📸 Gambar baru berhasil diupload!
```

### Managing Images

```
removeimage netflix
→ ✅ Berhasil menghapus gambar dari produk NETFLIX
   🗑️ Gambar: Telah dihapus
   📱 Status: Produk sekarang hanya berupa teks

previewlist netflix  
→ [Shows product with image if available]

list
→ *│» 🖼️ NETFLIX*     # Has image
   *│» 📝 SPOTIFY*     # Text only
```

--- 