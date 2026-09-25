# PANDUAN SETUP LIVE STOCK - NAUUVALSTORE

## 1. STRUKTUR GOOGLE SHEETS

Buat Google Sheet baru dengan nama "Nauuvalstore Inventory":

### Sheet 1: Inventory
| KATEGORI | NAMA BARANG | STOK | HARGA (IDR) | TERAKHIR DIPERBARUI |
|----------|-------------|------|-------------|---------------------|
| JOKI BLOX FRUIT | Joki Level 30 | 15 | 50000 | 2026-09-25 |
| JOKI BLOX FRUIT | Joki Level 50 | 8 | 120000 | 2026-09-25 |
| JOKI BLOX FRUIT | Joki Level 100 | 3 | 350000 | 2026-09-25 |
| JOKI FISCH | Joki Fisch Level 30 | 12 | 45000 | 2026-09-25 |
| JOKI FISCH | Joki Fisch Level 50 | 6 | 95000 | 2026-09-25 |
| KEBUTUHAN BLOX FRUIT | Diamond 70 | 25 | 75000 | 2026-09-25 |
| KEBUTUHAN BLOX FRUIT | Diamond 280 | 18 | 220000 | 2026-09-25 |
| KEBUTUHAN FISCH | Fisch Coins 50K | 40 | 5000 | 2026-09-25 |
| KEBUTUHAN FISCH | Fisch Coins 250K | 22 | 18000 | 2026-09-25 |

### Sheet 2: LogMutasi (otomatis dibuat script)
| TANGGAL | NAMA BARANG | TIPE | JUMLAH | STOK AKHIR | KETERANGAN |

## 2. DEPLOY GOOGLE APPS SCRIPT

1. Buka Google Sheet yang sudah dibuat
2. Klik Extensions > Apps Script
3. Copy isi file google-apps-script.js ke editor
4. Simpan dengan nama "NauuvalstoreAPI"
5. Klik Deploy > New deployment
6. Pilih Type: Web app
7. Execute as: Me
8. Who has access: Anyone
9. Klik Deploy
10. Copy URL yang diberikan

## 3. UPDATE KATALOG

Edit file katalog.html, cari baris:
`javascript
const API_ENDPOINT = 'https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec';
const USE_DUMMY_DATA = true;
`

Ganti menjadi:
`javascript
const API_ENDPOINT = 'https://script.google.com/macros/s/ID_DARI_DEPLOY/exec';
const USE_DUMMY_DATA = false;
`

## 4. FITUR TERSEDIA

### Halaman Katalog (katalog.html)
- Filter 4 kategori produk
- Tampilan stok live (auto refresh 60 detik)
- Tombol pesan langsung ke WhatsApp admin
- Indikator stok rendah (≤5) dan habis (0)

### API Endpoints
- GET /exec - Ambil semua produk (JSON)
- POST /exec - Update stok dengan body: {namaBarang, tipe: "IN"|"OUT", jumlah}

### Log Mutasi
- Setiap perubahan stok tercatat otomatis
- Berguna untuk tracking penjualan dan restock

## 5. UPDATE STOK

### Via Spreadsheet:
- Edit langsung kolom STOK di Google Sheet
- Kolom TERAKHIR DIPERBARUI otomatis update via script

### Via API (untuk integrasi):
`javascript
fetch('https://script.google.com/macros/s/ID/exec', {
  method: 'POST',
  body: JSON.stringify({
    namaBarang: 'Joki Level 30',
    tipe: 'OUT',
    jumlah: 1
  })
});
`

## 6. KATEGORI PRODUK

1. **JOKI BLOX FRUIT** - Layanan joki level akun Blox Fruits
2. **JOKI FISCH** - Layanan joki game Fisch
3. **KEBUTUHAN BLOX FRUIT** - Diamond, Beli, dll
4. **KEBUTUHAN FISCH** - Coins, Item, Relic, dll

## 7. DEPLOY KE VERCEL

1. Push folder ercel-deploy ke GitHub
2. Connect ke Vercel
3. Deploy otomatis

File yang perlu di-upload:
- index.html
- katalog.html
- google-apps-script.js (referensi)
- inventory.csv (template import)
- assets/ (folder gambar)
