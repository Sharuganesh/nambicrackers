/**
 * Nambi Crackers — Google Apps Script order receiver
 *
 * SETUP
 * 1. Open https://sheets.new and create a spreadsheet (any name).
 * 2. Extensions > Apps Script. Delete everything, paste this file, Save.
 * 3. Deploy > New deployment > type "Web app".
 *      Execute as: Me      Who has access: Anyone
 * 4. Copy the /exec URL and paste it into src/config.ts (APPS_SCRIPT_URL).
 *
 * Both doGet(e) and doPost(e) are handled. Orders are appended to the
 * "Responses" tab, which is created with bold headers if missing.
 */

var SHEET_NAME = 'Responses';

var HEADERS = [
  'Timestamp',
  'Name',
  'Mobile',
  'Email',
  'Address',
  'District',
  'State',
  'Pincode',
  'Order Items',
  'Total Qty',
  'Total Amount'
];

function doGet(e) {
  return handleRequest(e);
}

function doPost(e) {
  return handleRequest(e);
}

function handleRequest(e) {
  try {
    var params = {};

    // Query string params (used by the website)
    if (e && e.parameter) {
      for (var k in e.parameter) params[k] = e.parameter[k];
    }

    // JSON body support (optional)
    if (e && e.postData && e.postData.contents) {
      try {
        var body = JSON.parse(e.postData.contents);
        for (var j in body) params[j] = body[j];
      } catch (ignore) {}
    }

    var sheet = getSheet_();

    // Normalise item separators so every product lands on its own line
    // inside the cell (website may send " | " or newlines).
    var items = String(params.items || '')
      .split(/\s*\|\s*|\r?\n/)
      .filter(function (s) { return s !== ''; })
      .join(String.fromCharCode(10));

    var row = sheet.getLastRow() + 1;
    sheet.appendRow([
      new Date(),
      params.name || '',
      params.mobile || '',
      params.email || '',
      params.address || '',
      params.district || '',
      params.state || '',
      params.pincode || '',
      items,
      params.totalQty || '',
      params.totalAmount || ''
    ]);

    // Make the new row easy to read: wrap the items cell, top-align the row
    var newRow = sheet.getRange(row, 1, 1, HEADERS.length);
    newRow.setVerticalAlignment('top');
    sheet.getRange(row, 9).setWrap(true);
    sheet.setRowHeight(row, Math.max(21, items.split(String.fromCharCode(10)).length * 16));

    return json_({ success: true });
  } catch (err) {
    return json_({ success: false, error: String(err) });
  }
}

function getSheet_() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(SHEET_NAME);

  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
  }

  if (sheet.getLastRow() === 0) {
    sheet.appendRow(HEADERS);
    sheet
      .getRange(1, 1, 1, HEADERS.length)
      .setFontWeight('bold')
      .setBackground('#f3e5c0');
    sheet.setFrozenRows(1);
    sheet.setColumnWidth(9, 320); // Order Items column wide enough to read
  }

  return sheet;
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(
    ContentService.MimeType.JSON
  );
}
