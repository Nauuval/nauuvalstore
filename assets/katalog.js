// KATALOG.JS - VERCEL FIXED VERSION
// 1. Load langsung saat DOM ready
// 2. Pastikan defaultProducts selalu ada
// 3. Cek console.log untuk debugging

console.log("🔧 katalog.js loaded");

let allProducts = [];
let currentFilter = "all";
const STORAGE_KEY = "nauuval_inventory_v1"; // versi baru

const defaultProducts = [
  { kategori: "JOKI BLOX FRUIT", nama: "Joki Level 30", stok: 15, harga: 50000 },
  { kategori: "JOKI BLOX FRUIT", nama: "Joki Level 50", stok: 8, harga: 120000 },
  { kategori: "JOKI BLOX FRUIT", nama: "Joki Level 100", stok: 3, harga: 350000 },
  { kategori: "JOKI FISCH", nama: "Joki Fisch Level 30", stok: 12, harga: 45000 },
  { kategori: "JOKI FISCH", nama: "Joki Fisch Level 50", stok: 6, harga: 95000 },
  { kategori: "KEBUTUHAN BLOX FRUIT", nama: "Diamond 70", stok: 25, harga: 75000 },
  { kategori: "KEBUTUHAN BLOX FRUIT", nama: "Diamond 280", stok: 18, harga: 220000 },
  { kategori: "KEBUTUHAN FISCH", nama: "Fisch Coins 50K", stok: 40, harga: 5000 },
  { kategori: "KEBUTUHAN FISCH", nama: "Fisch Coins 250K", stok: 22, harga: 18000 }
];

function initCatalog() {
  console.log("🔄 Initializing catalog...");
  
  // Load dari localStorage, fallback ke default
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    console.log("📦 Stored data:", stored ? "yes" : "no");
    allProducts = stored ? JSON.parse(stored) : defaultProducts;
  } catch(e) {
    console.error("❌ localStorage error:", e);
    allProducts = defaultProducts;
  }
  
  console.log(📊 Total products: );
  updateStockStatus();
  renderProducts();
  setupFilters();
}

function updateStockStatus() {
  const total = allProducts.length;
  const inStock = allProducts.filter(p => p.stok > 0).length;
  const el = document.getElementById("stockStatus");
  if (el) {
    el.textContent = "Stok Live · " + inStock + "/" + total + " produk tersedia";
    console.log("📈 Stock status updated");
  }
}

function renderProducts() {
  const grid = document.getElementById("productsGrid");
  if (!grid) {
    console.error("❌ productsGrid element not found!");
    return;
  }
  
  const filtered = currentFilter === "all" 
    ? allProducts 
    : allProducts.filter(p => p.kategori === currentFilter);
  
  console.log(🎯 Filter "":  products);
  
  if (filtered.length === 0) {
    grid.innerHTML = "<div class='loading'>Tidak ada produk di kategori ini</div>";
    return;
  }
  
  grid.innerHTML = filtered.map(product => {
    const stockClass = product.stok === 0 ? "out" : product.stok <= 5 ? "low" : "";
    const btnText = product.stok === 0 ? "Stok Habis" : "Pesan Sekarang";
    const disabled = product.stok === 0 ? "disabled" : "";
    const safeName = product.nama.replace(/"/g, "&quot;");
    
    return '<div class="product-card visible">' +
      '<span class="product-category">' + product.kategori + '</span>' +
      '<h3 class="product-name">' + product.nama + '</h3>' +
      '<div class="product-stock">' +
        '<span class="stock-label">Stok tersedia</span>' +
        '<span class="stock-value ' + stockClass + '">' + product.stok + '</span>' +
      '</div>' +
      '<div class="product-price"><span>Rp</span> ' + product.harga.toLocaleString('id-ID') + '</div>' +
      '<button class="btn-order" ' + disabled + ' onclick="orderProduct(\'' + safeName + '\', ' + product.harga + ')">' + btnText + '</button>' +
    '</div>';
  }).join('');
  
  console.log("✅ Products rendered");
}

function setupFilters() {
  const buttons = document.querySelectorAll(".filter-btn");
  console.log(🎛️ Found  filter buttons);
  
  buttons.forEach(btn => {
    btn.addEventListener("click", function() {
      document.querySelectorAll(".filter-btn").forEach(b => b.classList.remove("active"));
      this.classList.add("active");
      currentFilter = this.dataset.category;
      console.log(🔍 Filter changed to: );
      renderProducts();
    });
  });
}

// Order function (global)
window.orderProduct = function(nama, harga) {
  const message = Halo min, saya mau pesan:\n\nProduk: \nHarga: Rp \n\nMohon konfirmasi ketersediaan dan detail pembayaran.;
  window.open(https://wa.me/6289529834425?text=, "_blank");
};

// Initialize on load
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initCatalog);
} else {
  initCatalog();
}

// Auto-refresh setiap 30 detik
setInterval(() => {
  console.log("🔄 Auto-refreshing products");
  initCatalog();
}, 30000);

console.log("✅ katalog.js initialization complete");
