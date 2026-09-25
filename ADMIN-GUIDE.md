# 📦 NAUUVALSTORE - ADMIN PANEL & KATALOG LIVE STOCK

Sistem inventory management dengan admin panel untuk Nauuvalstore.

## 🎯 Fitur Utama

### 1. Admin Panel (dmin.html)
- 🔐 Autentikasi password
- 📊 Dashboard dengan statistik inventory
- ➕ Tambah/edit/hapus produk
- 📈 Update stok (IN/OUT/SET)
- 📋 Log mutasi stok otomatis
- 💾 Data disimpan di localStorage

### 2. Katalog Publik (katalog.html)
- 🔄 Live stock (auto refresh 30 detik)
- 🏷️ 4 kategori filter
- 📱 Responsive design
- ⚡ Integrasi WhatsApp untuk order

## 📋 4 KATEGORI & CONTOH LAYANAN

### 1️⃣ JOKI BLOX FRUIT
Layanan joki/pembelian level akun Blox Fruits.

**Layanan yang bisa ditambahkan:**
- Joki Level 10-30 (Pemula)
- Joki Level 30-60 (Menengah)
- Joki Level 60-100+ (Advanced)
- Farm Uang/Beli (Rp)
- Farm Quest/Missio
- Joki Raid/Dungeon
- Grind Skill Power
- Beli Sword/Weapon tertentu
- Service Bounty Hunt
- Coaching 1-on-1

### 2️⃣ JOKI FISCH
Layanan joki/farm game Fisch.

**Layanan yang bisa ditambahkan:**
- Joki Level Awal (1-50)
- Joki Level Mid (50-100)
- Joki Level Max (100+)
- Farm Fish (ikan tertentu)
- Koleksi Fish Langka
- Upgrade Rod/Equipment
- Quest Completion
- Bait Grinding
- Festival Farm
- Boss Raid Service

### 3️⃣ KEBUTUHAN BLOX FRUIT
Item/material untuk Blox Fruits.

**Layanan yang bisa ditambahkan:**
- Diamond (berbagai nominal: 70, 280, 500, dll)
- Uang In-Game (transfer via joki)
- Fruit Tertentu (jika ada)
- Weapon Bundle
- Battle Pass
- Seasonal Skin/Cosmetic
- Starter Pack
- Reroll Service
- Level Boost Token
- Rumah/Island Decoration

### 4️⃣ KEBUTUHAN FISCH
Item untuk Fisch.

**Layanan yang bisa ditambahkan:**
- Fisch Coins (50K, 100K, 250K, 500K)
- Rod Premium
- Bait Bundle
- Boat Upgrade
- Island Pass
- Pet Companion
- Collectible Item
- Event Pass
- Cosmetic Skin
- Equipment Chest

## 🚀 CARA MENGGUNAKAN

### Login ke Admin Panel
1. Buka dmin.html
2. Password default: 
auuval2026
3. Ubah password: Edit file dan ganti nilai ADMIN_PASSWORD

### Tambah Produk Baru
1. Klik "+ Tambah Produk"
2. Pilih kategori
3. Isi nama, stok, harga
4. Klik Simpan

### Update Stok
1. Klik tombol "Stok" di tabel inventory
2. Pilih tipe: IN (tambah), OUT (kurangi), SET (tetapkan)
3. Input jumlah
4. Klik Update (otomatis tercatat di Log Mutasi)

### Lihat Katalog Publik
1. Klik "Lihat Katalog" di admin panel
2. Atau buka katalog.html langsung
3. Filter kategori & pesan via WhatsApp

## 💾 STRUKTUR DATA

### Products (localStorage key: 
auuval_inventory)
\\\json
{
  "id": 1,
  "kategori": "JOKI BLOX FRUIT",
  "nama": "Joki Level 30",
  "stok": 15,
  "harga": 50000
}
\\\

### Logs (localStorage key: 
auuval_logs)
\\\json
{
  "waktu": "2026-09-25T19:33:28.554Z",
  "nama": "Joki Level 30",
  "tipe": "OUT",
  "jumlah": 1,
  "stokAkhir": 14
}
\\\

## 📊 STATISTIK YANG TERSEDIA

- Total Produk
- Total Stok
- Stok Habis
- Nilai Inventory (total stok x harga)

## 🔐 KEAMANAN

⚠️ **Catatan:** Admin panel ini menggunakan password sederhana. Untuk production:
- Host di HTTPS
- Gunakan authentication yang lebih kuat
- Backup data secara berkala
- Gunakan environment variable untuk password

## 📱 RESPONSIVE

✅ Mobile-friendly
✅ Tablet-optimized  
✅ Desktop-full

## 🎨 TEMA

Mengikuti desain Nauuvalstore yang sudah ada:
- Dark theme (#08080A)
- Panel color (#131316, #1B1B1F)
- Typography: Sora + Inter

## 📁 FILE STRUKTUR

`
vercel-deploy/
├── index.html          # Homepage
├── katalog.html        # Katalog publik
├── admin.html          # Admin panel
├── assets/
│   ├── katalog.js      # Script katalog
│   └── logo.png        # Brand logo
└── README.txt          # Dokumentasi
`

## 🔄 WORKFLOW

1. **Admin** → Buka dmin.html → Login → Kelola produk & stok
2. **Stok Updated** → Disimpan ke localStorage → Auto-sync
3. **Publik** → Buka katalog.html → Lihat produk live → Pesan via WhatsApp

## ⚡ PERFORMA

- Load time: < 1 detik
- Auto-refresh: 30 detik (katalog)
- Data persistence: localStorage (semua browser)
- Zero dependencies: Pure HTML/CSS/JS

## 🎓 CONTOH SKENARIO

**Scenario 1: Update Stok Joki Level 30**
- Admin: Buka admin.html → Masuk → Cari "Joki Level 30" → Klik Stok
- Admin: Type: OUT, Qty: 2 → Update
- Result: Stok berkurang dari 15 → 13, tercatat di log
- Publik: Katalog auto-update stok (30 detik kemudian)

**Scenario 2: Tambah Produk Baru**
- Admin: Klik "+ Tambah Produk"
- Input: Kategori: KEBUTUHAN BLOX FRUIT, Nama: Diamond 500, Stok: 100, Harga: 350000
- Result: Produk muncul di katalog, visible untuk publik

**Scenario 3: Customer Order**
- Customer: Buka katalog.html
- Filter: "JOKI BLOX FRUIT"
- Lihat produk → Stok tersedia
- Klik "Pesan Sekarang" → WhatsApp dengan detail otomatis

## 🛠️ MAINTENANCE

### Backup Data
\\\javascript
// Di console browser (admin panel)
const backup = localStorage.getItem('nauuval_inventory');
console.log(backup); // Copy & simpan di file JSON
\\\

### Restore Data
\\\javascript
localStorage.setItem('nauuval_inventory', backupData);
location.reload();
\\\

### Clear All Data
\\\javascript
localStorage.removeItem('nauuval_inventory');
localStorage.removeItem('nauuval_logs');
location.reload();
\\\

## 📞 KONTAK ADMIN

WhatsApp: 6289529834425 (hardcoded di sistem, bisa diubah di katalog.html)

---

**Last Updated:** 2026-09-26
**Version:** 1.0
