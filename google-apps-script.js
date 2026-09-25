// GOOGLE APPS SCRIPT - INVENTORY API
// Deploy sebagai Web App untuk mendapatkan URL API

function doGet() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Inventory');
  var data = sheet.getDataRange().getValues();
  
  var headers = data[0];
  var products = [];
  
  for (var i = 1; i < data.length; i++) {
    if (data[i][0]) {
      products.push({
        kategori: data[i][0],
        nama: data[i][1],
        stok: data[i][2],
        harga: data[i][3],
        terakhirDiperbarui: data[i][4]
      });
    }
  }
  
  return ContentService
    .createTextOutput(JSON.stringify(products))
    .setMimeType(ContentService.MimeType.JSON);
}

// Update stok - panggil via POST
function doPost(e) {
  var params = JSON.parse(e.postData.contents);
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Inventory');
  var data = sheet.getDataRange().getValues();
  
  for (var i = 1; i < data.length; i++) {
    if (data[i][1] === params.namaBarang) {
      var newStock = params.tipe === 'IN' 
        ? data[i][2] + params.jumlah 
        : Math.max(0, data[i][2] - params.jumlah);
      
      sheet.getRange(i + 1, 3).setValue(newStock);
      sheet.getRange(i + 1, 5).setValue(new Date());
      
      logMutation(params.namaBarang, params.tipe, params.jumlah, newStock);
      
      return ContentService
        .createTextOutput(JSON.stringify({ success: true, stokAkhir: newStock }))
        .setMimeType(ContentService.MimeType.JSON);
    }
  }
  
  return ContentService
    .createTextOutput(JSON.stringify({ success: false, message: 'Produk tidak ditemukan' }))
    .setMimeType(ContentService.MimeType.JSON);
}

function logMutation(namaBarang, tipe, jumlah, stokAkhir) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('LogMutasi');
  if (!sheet) {
    sheet = SpreadsheetApp.getActiveSpreadsheet().insertSheet('LogMutasi');
    sheet.appendRow(['TANGGAL', 'NAMA BARANG', 'TIPE', 'JUMLAH', 'STOK AKHIR', 'KETERANGAN']);
  }
  
  sheet.appendRow([
    new Date(),
    namaBarang,
    tipe,
    jumlah,
    stokAkhir,
    'Update via API'
  ]);
}

// Setup trigger untuk auto-sync
function setupTriggers() {
  var triggers = ScriptApp.getProjectTriggers();
  triggers.forEach(function(trigger) {
    ScriptApp.deleteTrigger(trigger);
  });
  
  ScriptApp.newTrigger('autoRefresh')
    .timeBased()
    .everyHours(1)
    .create();
}

function autoRefresh() {
  Logger.log('Auto refresh at ' + new Date());
}
