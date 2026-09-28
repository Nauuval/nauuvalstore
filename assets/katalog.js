let allProducts = [];
let currentFilter = "all";
const STORAGE_KEY = "nauuval_inventory";

const SUPABASE_URL = "https://iporesqjsbrmlhzgikdg.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imlwb3Jlc3Fqc2JybWxoemdpa2RnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTA1NzkyMzIsImV4cCI6MjEwNjE1NTIzMn0.6g-Z-dSxtdGznBFlljBiaSRWr7RNdPo6SKlKNr9m-54";

const defaultProductsRaw = [
  { id: 1, kategori: "JOKI BLOX FRUIT", nama: "Joki Level 30", stok: 15, harga: 50000, harga_asli: 65000 },
  { id: 2, kategori: "JOKI BLOX FRUIT", nama: "Joki Level 50", stok: 8, harga: 120000, harga_asli: 150000 },
  { id: 3, kategori: "JOKI BLOX FRUIT", nama: "Joki Level 100", stok: 3, harga: 350000, harga_asli: 400000 },
  { id: 4, kategori: "JOKI FISCH", nama: "Joki Fisch Level 30", stok: 12, harga: 45000, harga_asli: 60000 },
  { id: 5, kategori: "JOKI FISCH", nama: "Joki Fisch Level 50", stok: 6, harga: 95000, harga_asli: 120000 },
  { id: 6, kategori: "KEBUTUHAN BLOX FRUIT", nama: "Diamond 70", stok: 25, harga: 75000, harga_asli: 90000 },
  { id: 7, kategori: "KEBUTUHAN BLOX FRUIT", nama: "Diamond 280", stok: 18, harga: 220000, harga_asli: 250000 },
  { id: 8, kategori: "KEBUTUHAN FISCH", nama: "Fisch Coins 50K", stok: 40, harga: 5000, harga_asli: 8000 },
  { id: 9, kategori: "KEBUTUHAN FISCH", nama: "Fisch Coins 250K", stok: 22, harga: 18000, harga_asli: 25000 }
];

function loadFromLocalStorage() {
  try {
    var stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      allProducts = JSON.parse(stored);
    } else {
      allProducts = [];
    }
  } catch(e) {
    allProducts = [];
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
    if (Array.isArray(data)) {
      allProducts = data;
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); } catch(e) {}
      return true;
    }
  } catch(e) {
    console.warn("Supabase load error, fallback to JSON/LocalStorage:", e);
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
        if (Array.isArray(data)) {
          allProducts = data;
          try { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); } catch(e) {}
        } else {
          allProducts = [];
        }
      } else {
        allProducts = defaultProductsRaw;
      }
    } catch(e) {
      allProducts = defaultProductsRaw;
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

function isNeedCategory(kategori) {
  return kategori.indexOf("KEBUTUHAN") !== -1;
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
    var btnText = product.stok === 0 ? "Stok Habis" : "Order";
    var disabled = product.stok === 0 ? "disabled" : "";
    var safeName = product.nama.replace(/'/g, "\\'");
    var safeKategori = product.kategori.replace(/'/g, "\\'");

    var hasDiscount = product.harga_asli && product.harga_asli > product.harga;
    var discountPercent = hasDiscount
      ? Math.round(((product.harga_asli - product.harga) / product.harga_asli) * 100)
      : 0;

    var discountBadge = hasDiscount
      ? `<div class="discount-badge">HEMAT ${discountPercent}%</div>`
      : "";

    var priceHtml = "";
    if (hasDiscount) {
      priceHtml = `<div class="price-wrapper">
        <span class="original-price">Rp ${product.harga_asli.toLocaleString("id-ID")}</span>
        <div class="discounted-price"><span>Rp</span> ${product.harga.toLocaleString("id-ID")}</div>
      </div>`;
    } else {
      priceHtml = `<div class="product-price"><span>Rp</span> ${product.harga.toLocaleString("id-ID")}</div>`;
    }

    var hargaAsliVal = product.harga_asli ? product.harga_asli : 0;

    return `<div class="product-card visible">` +
      discountBadge +
      `<span class="product-category">${product.kategori}</span>` +
      `<h3 class="product-name">${product.nama}</h3>` +
      `<div class="product-stock">` +
        `<span class="stock-label">Stok tersedia</span>` +
        `<span class="stock-value ${stockClass}">${product.stok}</span>` +
      `</div>` +
      priceHtml +
      `<button class="btn-order" ${disabled} onclick="openOrderModal('${safeName}', ${product.harga}, '${safeKategori}', ${product.stok}, ${hargaAsliVal})">${btnText}</button>` +
    `</div>`;
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

// ============= ORDER MODAL LOGIC =============
let currentOrder = null;

window.openOrderModal = function(nama, harga, kategori, stok, hargaAsli) {
  var hasQty = isNeedCategory(kategori);
  var maxStok = stok > 0 ? stok : 1;

  currentOrder = {
    nama: nama,
    harga: harga,
    hargaAsli: hargaAsli || 0,
    kategori: kategori,
    stok: stok,
    maxStok: maxStok,
    qty: 1,
    hasQty: hasQty
  };

  document.getElementById("modalCategory").textContent = kategori;
  document.getElementById("modalName").textContent = nama;
  document.getElementById("modalStock").textContent = stok;

  var qtySection = document.getElementById("modalQtySection");
  var calcQtyRow = document.getElementById("calcQtyRow");
  var qtyInput = document.getElementById("modalQtyInput");

  if (hasQty) {
    qtySection.style.display = "block";
    calcQtyRow.style.display = "flex";
    qtyInput.value = 1;
    qtyInput.max = maxStok;
  } else {
    qtySection.style.display = "none";
    calcQtyRow.style.display = "none";
    qtyInput.value = 1;
  }

  updateModalCalculation();
  document.getElementById("orderModal").classList.add("active");
};

window.closeOrderModal = function(event) {
  if (event && event.target && event.target.id !== "orderModal" && !event.target.classList.contains("order-modal-close") && !event.target.classList.contains("btn-modal-cancel")) {
    return;
  }
  document.getElementById("orderModal").classList.remove("active");
  currentOrder = null;
};

window.stepModalQty = function(delta) {
  if (!currentOrder || !currentOrder.hasQty) return;
  var qtyInput = document.getElementById("modalQtyInput");
  var val = parseInt(qtyInput.value) || 1;
  val += delta;
  if (val < 1) val = 1;
  if (val > currentOrder.maxStok) val = currentOrder.maxStok;
  qtyInput.value = val;
  currentOrder.qty = val;
  updateModalCalculation();
};

function updateModalCalculation() {
  if (!currentOrder) return;
  var total = currentOrder.harga * currentOrder.qty;
  var hasDiscount = currentOrder.hargaAsli && currentOrder.hargaAsli > currentOrder.harga;

  if (hasDiscount) {
    var totalHemat = (currentOrder.hargaAsli - currentOrder.harga) * currentOrder.qty;
    document.getElementById("modalPrice").innerHTML = `<span style="text-decoration:line-through;color:var(--ash);font-size:0.85rem;margin-right:6px;">Rp ${currentOrder.hargaAsli.toLocaleString("id-ID")}</span> <strong style="color:#2ECC71;">Rp ${currentOrder.harga.toLocaleString("id-ID")}</strong>`;
    document.getElementById("calcUnitPrice").innerHTML = `<span style="text-decoration:line-through;color:var(--ash);font-size:0.8rem;margin-right:4px;">Rp ${currentOrder.hargaAsli.toLocaleString("id-ID")}</span> Rp ${currentOrder.harga.toLocaleString("id-ID")} <span style="color:#FF3366;font-size:0.75rem;font-weight:700;">(Hemat Rp ${totalHemat.toLocaleString("id-ID")})</span>`;
  } else {
    document.getElementById("modalPrice").textContent = "Rp " + currentOrder.harga.toLocaleString("id-ID");
    document.getElementById("calcUnitPrice").textContent = "Rp " + currentOrder.harga.toLocaleString("id-ID");
  }

  document.getElementById("calcQtyCount").textContent = currentOrder.qty + "x";
  document.getElementById("calcTotalPrice").textContent = "Rp " + total.toLocaleString("id-ID");
}

window.confirmAndSendWA = function() {
  if (!currentOrder) return;
  var total = currentOrder.harga * currentOrder.qty;
  var qtyLine = currentOrder.hasQty ? "Jumlah: " + currentOrder.qty + "\n" : "";
  var hasDiscount = currentOrder.hargaAsli && currentOrder.hargaAsli > currentOrder.harga;
  var discountNote = "";

  if (hasDiscount) {
    var hemat = (currentOrder.hargaAsli - currentOrder.harga) * currentOrder.qty;
    discountNote = "Promo Diskon: Ya (Hemat Rp " + hemat.toLocaleString("id-ID") + ")\n";
  }

  var message = "Halo min, saya mau pesan:\n\n" +
    "Produk: " + currentOrder.nama + "\n" +
    "Kategori: " + currentOrder.kategori + "\n" +
    "Harga Promo: Rp " + currentOrder.harga.toLocaleString("id-ID") + "\n" +
    discountNote +
    qtyLine +
    "Total Pembayaran: Rp " + total.toLocaleString("id-ID") + "\n\n" +
    "Mohon konfirmasi ketersediaan dan detail pembayaran.";

  window.open("https://wa.me/6289529834425?text=" + encodeURIComponent(message), "_blank");
  closeOrderModal();
};

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initCatalog);
} else {
  initCatalog();
}

setInterval(initCatalog, 15000);