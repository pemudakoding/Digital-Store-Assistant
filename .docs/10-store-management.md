# 🛍️ Store Management Guide

Panduan lengkap mengelola toko digital dengan KoalaStore WhatsApp Bot.

## 🎯 Overview

KoalaStore Bot menyediakan sistem manajemen toko yang comprehensive dengan fitur:
- **Product Catalog Management** - Kelola katalog produk global
- **Group-specific Lists** - List produk per grup
- **Order Processing** - Template dan tracking order
- **Customer Testimonials** - Sistem review dan rating
- **Customer Support** - Auto-response dan template system
- **Analytics** - Tracking performa toko

## 🏪 Setup Store

### 1. Basic Store Configuration

Edit `setting.js`:

```javascript
const setting = {
  // Store Information
  ownerName: "KoalaStore Digital",
  storeName: "🐨 KOALASTORE DIGITAL",
  storeDescription: "Premium Digital Products & Services",
  
  // Contact Information
  ownerNumber: ["628123456789"],
  kontakOwner: "628123456789",
  
  // Store Mode
  public: true, // true = open untuk semua, false = private
};
```

### 2. Social Media Configuration

Setup social media links di `src/config/settings.js`:

```javascript
const config = {
  links: {
    youtube: "https://youtube.com/channel/yourchannel",
    instagram: "https://instagram.com/youraccount", 
    groupLink1: "https://chat.whatsapp.com/grouplink1",
    groupLink2: "https://chat.whatsapp.com/grouplink2"
  }
};
```

### 3. Upload Bot Media

```bash
# Ganti thumbnail bot
# Upload file ke gambar/thumbnail.jpg
# File akan otomatis digunakan sebagai profile picture bot
```

## 📦 Product Management

### Product Catalog vs Group Lists

KoalaStore menggunakan 2 sistem produk:

1. **Product Catalog** (`database/list-produk.json`) - Katalog global owner
2. **Group Lists** (`database/list.json`) - List produk per grup

### Manage Product Catalog (Owner)

#### Add Product to Catalog
```bash
addproduk Netflix Premium|25000|Akun Netflix Premium 1 Bulan dengan garansi dan support 24/7

# Format: nama|harga|deskripsi
```

#### Delete Product from Catalog
```bash
delproduk Netflix Premium
```

#### View All Products
Products disimpan di `database/list-produk.json`:
```json
[
  {
    "id": "prod-001",
    "name": "Netflix Premium",
    "price": "25000", 
    "description": "Akun Netflix Premium 1 Bulan dengan garansi",
    "category": "streaming",
    "status": "active",
    "created_at": "2024-01-01T00:00:00.000Z"
  }
]
```

### Manage Group Lists (Admin)

#### Add Product to Group List
```bash
addlist Netflix Premium|Akun Netflix Premium 1 Bulan - Rp 25.000
```

#### Update Product in List
```bash
updatelist Netflix Premium|Akun Netflix Premium 1 Bulan - Rp 20.000 (DISKON!)
```

#### Delete Product from List
```bash
dellist Netflix Premium
```

#### View Group Products
```bash
list
```

Group akan melihat:
```
*── .✦ Date : Minggu, 15 Januari 2024*
*── .✦ Time : 14:30:25*

*╭─────✧ [ LIST PRODUK ]*
*│»* *NETFLIX PREMIUM*
*│»* *SPOTIFY PREMIUM*  
*│»* *YOUTUBE PREMIUM* *「CLOSED」*
*│*
*╰───────✧*

Untuk melihat detail produk silahkan kirim nama produk.
🌟 *Ketik testi untuk lihat testimoni customer*
```

## 📋 Order Processing

### Setup Order Templates

#### Set Processing Template
```bash
setproses ⏳ *ORDER SEDANG DIPROSES*

Hai kak @user, terima kasih sudah order!

📦 Produk: [PRODUK]
💰 Total: [HARGA]
🕒 Estimasi: 1-3 jam

Kami akan update progressnya ya! 
Terima kasih sudah percaya dengan kami 🙏

_- KoalaStore Team_
```

#### Set Completion Template
```bash
setdone ✅ *ORDER SELESAI*

Hai kak @user!

Pesanan sudah ready nih! 🎉

📦 Produk: [PRODUK]
💰 Total: [HARGA] 
📧 Detail: Cek chat pribadi ya

Jangan lupa kasih testimoni kalau puas! ⭐
Terima kasih sudah order di KoalaStore 💖
```

### Process Orders

#### Mark Order as Processing
```bash
# Reply ke pesan order customer:
proses
```

#### Mark Order as Complete
```bash
# Reply ke pesan order customer:
done
```

### Order Flow Example

1. **Customer orders:**
   ```
   Customer: Mau order Netflix Premium
   ```

2. **Admin processes:**
   ```
   Admin: proses
   Bot: [Kirim template processing dengan mention customer]
   ```

3. **Admin completes:**
   ```
   Admin: done
   Bot: [Kirim template completion dengan mention customer]
   ```

## 🌟 Testimonials Management

### Add Testimonial (Owner)
```bash
addtesti John Doe|Netflix Premium|5|Pelayanan sangat memuaskan! Fast response dan produk berkualitas

# Format: nama|produk|rating|komentar
```

### Delete Testimonial (Owner)
```bash
deltesti testi-001
```

### View Testimonials
```bash
testi
```

Customers akan melihat:
```
⭐ *CUSTOMER TESTIMONIALS*

👤 *John Doe*
📦 Netflix Premium
⭐ Rating: 5/5
💬 "Pelayanan sangat memuaskan! Fast response dan produk berkualitas"
📅 15 Jan 2024

👤 *Jane Smith*  
📦 Spotify Premium
⭐ Rating: 5/5
💬 "Recommended seller! Trusted dan amanah"
📅 14 Jan 2024

_Terima kasih atas kepercayaannya! 🙏_
```

### Testimonial Database Structure

`database/list-testi.json`:
```json
[
  {
    "id": "testi-001",
    "customer": "John Doe",
    "product": "Netflix Premium", 
    "rating": 5,
    "comment": "Pelayanan sangat memuaskan!",
    "date": "2024-01-15T00:00:00.000Z"
  }
]
```

## 💳 Payment Information

### Setup Payment Command

Customer dapat melihat info pembayaran dengan:
```bash
payment
```

Output:
```
💳 *PAYMENT INFORMATION*

💰 *E-Wallet:*
📱 DANA: 08123456789
📱 OVO: 08123456789  
📱 GoPay: 08123456789

🏦 *Bank Transfer:*
🏧 BCA: 1234567890
👤 a.n Your Store Name

📱 *QRIS:*
[Gambar QR Code]

🎁 *Donasi:*
💝 Saweria: https://saweria.co/youraccount

_Konfirmasi pembayaran ke admin setelah transfer ya! 📸_
```

### Update Payment Info

1. **Via Environment Variables:**
   ```env
   DANA_NUMBER=08123456789
   OVO_NUMBER=08123456789
   GOPAY_NUMBER=08123456789
   ```

2. **Via Config File:**
   ```javascript
   // src/config/settings.js
   payment: {
     dana: "08123456789",
     ovo: "08123456789",
     gopay: "08123456789"
   }
   ```

3. **Update QR Code:**
   ```bash
   gantiqris
   # Upload gambar QRIS baru
   ```

## 📊 Store Analytics

### Built-in Analytics

Bot automatically tracks:
- Command usage frequency
- Popular products
- Customer interactions
- Order completion rates

### Access Analytics Data

Data tersimpan di log files dan dapat dianalisis:

```bash
# View command usage
grep "Command executed" logs/bot.log

# View popular products  
grep "Product viewed" logs/bot.log

# View order processing
grep "Order processed" logs/bot.log
```

### Future Analytics Features

Planned features:
- **Dashboard Web** - Visual analytics
- **Sales Reports** - Daily/weekly/monthly reports
- **Customer Insights** - Behavior analysis
- **Performance Metrics** - Response time, conversion rates

## 🎯 Marketing Features

### Broadcast Messages

Send promotional messages to all chats:

```bash
broadcast 🎉 PROMO SPECIAL!

Flash Sale Netflix Premium!
Harga Normal: Rp 25.000
Harga Promo: Rp 20.000

Valid sampai besok ya!
Buruan order sebelum kehabisan! 🔥
```

### Welcome Messages

Setup welcome messages untuk grup:

```bash
welcome on

# Customize welcome message di database/welcome.json
```

### Auto-Reply Keywords

Setup auto-reply untuk keywords populer:

```json
// Dalam database/list.json per grup
{
  "key": "promo",
  "response": "🎉 Lagi ada promo nih! Cek list produk untuk detail lengkap!",
  "isImage": false
}
```

## 🔧 Advanced Store Features

### Product Categories

Organize products by categories:

```javascript
// Enhanced product structure
{
  "id": "prod-001",
  "name": "Netflix Premium",
  "category": "streaming", // streaming, gaming, software, etc
  "price": "25000",
  "tags": ["entertainment", "premium", "monthly"],
  "availability": "in-stock"
}
```

### Stock Management

Track product availability:

```javascript
// Product with stock tracking
{
  "id": "prod-001", 
  "name": "Netflix Premium",
  "stock": 10,
  "sold": 5,
  "status": "available" // available, low-stock, out-of-stock
}
```

### Pricing Tiers

Different prices for different customer types:

```javascript
{
  "id": "prod-001",
  "name": "Netflix Premium", 
  "pricing": {
    "regular": "25000",
    "member": "22000", 
    "vip": "20000"
  }
}
```

## 🛡️ Store Security

### Order Verification

```javascript
// Verify customer orders
function verifyOrder(customer, product, amount) {
  // Check customer history
  // Validate product availability
  // Confirm payment amount
  return verification;
}
```

### Anti-Fraud Protection

- **Rate limiting** - Prevent spam orders
- **Blacklist system** - Block problematic customers  
- **Order validation** - Verify legitimate orders
- **Payment confirmation** - Manual verification required

## 📈 Store Optimization

### Performance Tips

1. **Optimize product lists** - Keep descriptions concise
2. **Use categories** - Organize products logically
3. **Regular cleanup** - Remove old/inactive products
4. **Monitor analytics** - Track popular items
5. **Update templates** - Keep messages fresh and engaging

### Customer Experience

1. **Quick responses** - Use templates for efficiency
2. **Clear instructions** - Provide detailed order process
3. **Multiple payment options** - Offer various payment methods
4. **Follow-up** - Ask for testimonials after completion
5. **Proactive support** - Address issues quickly

## 🚀 Growth Strategies

### Customer Retention

- **Loyalty programs** - Discounts for repeat customers
- **Exclusive offers** - Member-only products/prices
- **Regular updates** - Keep customers informed about new products
- **Quality service** - Fast response and reliable delivery

### Business Expansion

- **Multi-group management** - Scale across multiple groups
- **Partner network** - Collaborate with other sellers
- **Product diversification** - Expand product offerings
- **Automation** - Increase efficiency with more automation

## 🎯 Next Steps

1. **[Commands Guide](.docs/07-commands.md)** - Master all store commands
2. **[Admin Features](.docs/09-admin-features.md)** - Advanced administration
3. **[API Reference](.docs/06-api-reference.md)** - Technical integration
4. **[Contributing](.docs/10-contributing.md)** - Add custom features

---

**Pro Tips:** 
- Gunakan testimonials untuk build trust
- Update payment info secara berkala  
- Monitor competitor pricing
- Focus on customer satisfaction untuk long-term success! 🚀 