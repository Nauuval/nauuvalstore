let allProducts = [];
let currentFilter = "all";
const STORAGE_KEY = "nauuval_inventory";

const SUPABASE_URL = "https://iporesqjsbrmlhzgikdg.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imlwb3Jlc3Fqc2JybWxoemdpa2RnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTA1NzkyMzIsImV4cCI6MjEwNjE1NTIzMn0.6g-Z-dSxtdGznBFlljBiaSRWr7RNdPo6SKlKNr9m-54";

const defaultProducts = [
  { id: 1, kategori: "JOKI BLOX FRUIT", nama: "Joki Level 30", stok: 15, harga: 50000 },
  { id: 2, kategori: "JOKI BLOX FRUIT", nama: "Joki Level 50", stok: 8, harga: 120000 },
  { id: 3, kategori: "JOKI BLOX FRUIT", nama: "Joki Level 100", stok: 3, harga: 350000 },
  { id: 4, kategori: "JOKI FISCH", nama: "Joki Fisch Level 30", stok: 12, harga: 45000 },
  { id: 5, kategori: "JOKI FISCH", nama: "Joki Fisch Level 50", stok: 6, harga: 95000 },
  { id: 6, kategori: "KEBUTUHAN BLOX FRUIT", nama: "Diamond 70", stok: 25, harga: 75000 },
  { id: 7, kategori: "KEBUTUHAN BLOX FRUIT", nama: "Diamond 280", stok: 18, harga: 220000 },
  { id: 8, kategori: "KEBUTUHAN FISCH", nama: "Fisch Coins 50K", stok: 40, harga: 5000 },
  { id: 9, kategori: "KEBUTUHAN FISCH", nama: "Fisch Coins 250K", stok: 22, harga: 18000 }
];

function loadFromLocalStorage() {
  try {
    var stored = localStorage.getItem(STORAGE_KEY);
    allProducts = stored ? JSON.parse(stored) : defaultProducts;
  } catch(e) {
    allProducts = defaultProducts;
  }
}

async function fetchFromSupabase() {
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/products?select=*&order=id.asc`, {
      headers: {
        "apikey": SUPABASE_KEY,
        "Authorization": `Bearer ${SUPABASE_KEY}`
      }
    });
    if (!res.ok) throw new Error("Supabase fetch failed");
    const data = await res.json();
    if (Array.isArray(data) && data.length > 0) {
      allProducts = data;
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); } catch(e) {}
      return true;
    }
  } catch(e) {
    console.warn("Supabase load error, falling back to JSON/LocalStorage:", e);
  }
  return false;
}

async function initCatalog() {
  const success = await fetchFromSupabase();
  if (!success) {
    var url = "products.json?v=" + Date.now();
    try {
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          allProducts = data;
        } else {
          loadFromLocalStorage();
        }
      } else {
        loadFromLocalStorage();
      }
    } catch(e) {
      loadFromLocalStorage();
    }
  }
  updateStockStatus();
  renderProducts();
  setupFilters();
}

function updateStockStatus() {
  var total = allProducts.length;
  var inStock = allProducts.filter(function(p) { return p.stok > 0; }).length;
  var el = document.getElementById("stockStatus");
  if (el) el.textContent = "Stok Live - " + inStock + "/" + total + " produk tersedia";
}

function renderProducts() {
  var grid = document.getElementById("productsGrid");
  if (!grid) return;
  var filtered = currentFilter === "all"
    ? allProducts
    : allProducts.filter(function(p) { return p.kategori === currentFilter; });
  if (filtered.length === 0) {
    grid.innerHTML = "<div class='loading'>Tidak ada produk di kategori ini</div>";
    return;
  }
  grid.innerHTML = filtered.map(function(product) {
    var stockClass = product.stok === 0 ? "out" : product.stok <= 5 ? "low" : "";
    var btnText = product.stok === 0 ? "Stok Habis" : "Pesan Sekarang";
    var disabled = product.stok === 0 ? "disabled" : "";
    var safeName = product.nama.replace(/'/g, "\\'");
    return "<div class=\"product-card visible\">" +
      "<span class=\"product-category\">" + product.kategori + "</span>" +
      "<h3 class=\"product-name\">" + product.nama + "</h3>" +
      "<div class=\"product-stock\">" +
        "<span class=\"stock-label\">Stok tersedia</span>" +
        "<span class=\"stock-value " + stockClass + "\">" + product.stok + "</span>" +
      "</div>" +
      "<div class=\"product-price\"><span>Rp</span> " + product.harga.toLocaleString("id-ID") + "</div>" +
      "<button class=\"btn-order\" " + disabled + " onclick=\"orderProduct('" + safeName + "', " + product.harga + ")\">" + btnText + "</button>" +
    "</div>";
  }).join("");
}

function setupFilters() {
  document.querySelectorAll(".filter-btn").forEach(function(btn) {
    btn.addEventListener("click", function() {
      document.querySelectorAll(".filter-btn").forEach(function(b) { b.classList.remove("active"); });
      this.classList.add("active");
      currentFilter = this.dataset.category;
      renderProducts();
    });
  });
}

window.orderProduct = function(nama, harga) {
  var message = "Halo min, saya mau pesan:\n\nProduk: " + nama + "\nHarga: Rp " + harga.toLocaleString("id-ID") + "\n\nMohon konfirmasi ketersediaan dan detail pembayaran.";
  window.open("https://wa.me/6289529834425?text=" + encodeURIComponent(message), "_blank");
};

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initCatalog);
} else {
  initCatalog();
}

// Auto sync refresh every 15 seconds
setInterval(initCatalog, 15000);