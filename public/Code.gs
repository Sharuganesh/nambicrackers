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
 * "Responses" tab and the invoice PDF is emailed to the shop and customer.
 */

var SHEET_NAME = 'Responses';
var SHOP_EMAIL = 'nambicrackersorder@gmail.com';
var SHOP_NAME = 'Nambi Crackers';

var HEADERS = [
  'Timestamp',
  'Order ID',
  'Name',
  'Mobile',
  'Email',
  'Address',
  'District',
  'State',
  'Pincode',
  'Order Items',
  'Total Qty',
  'MRP Total',
  'Discount',
  'Total Amount',
  'Status'
];

function doGet(e) {
  if (e && e.parameter && e.parameter.action === 'list') {
    return listOrders_();
  }
  if (e && e.parameter && e.parameter.action === 'track') {
    return trackOrders_(e.parameter.query || '');
  }
  return handleRequest(e);
}

function doPost(e) {
  return handleRequest(e);
}

function handleRequest(e) {
  try {
    var params = {};

    if (e && e.parameter) {
      for (var k in e.parameter) params[k] = e.parameter[k];
    }

    if (e && e.postData && e.postData.contents) {
      try {
        var body = JSON.parse(e.postData.contents);
        for (var j in body) params[j] = body[j];
      } catch (ignore) {}
    }

    var sheet = getSheet_();

    var items = String(params.items || '')
      .split(/\s*\|\s*|\r?\n/)
      .filter(function (s) { return s !== ''; })
      .join(String.fromCharCode(10));

    var orderId = params.orderId || ('ORD-' + Utilities.formatDate(new Date(), 'Asia/Kolkata', 'yyMMdd-HHmmss'));

    var row = sheet.getLastRow() + 1;
    sheet.appendRow([
      new Date(),
      orderId,
      params.name || '',
      params.mobile || '',
      params.email || '',
      params.address || '',
      params.district || '',
      params.state || '',
      params.pincode || '',
      items,
      params.totalQty || '',
      params.mrpTotal || '',
      params.discountAmount || '',
      params.totalAmount || '',
      'Confirmed'
    ]);

    applyStatusValidation_(sheet, row);

    var newRow = sheet.getRange(row, 1, 1, HEADERS.length);
    newRow.setVerticalAlignment('top');
    sheet.getRange(row, 10).setWrap(true);
    sheet.setRowHeight(row, Math.max(21, items.split(String.fromCharCode(10)).length * 16));

    sendInvoiceMails_(params, orderId, items);

    return json_({ success: true, orderId: orderId });
  } catch (err) {
    return json_({ success: false, error: String(err) });
  }
}

function sendInvoiceMails_(params, orderId, items) {
  try {
    var attachments = [];
    if (params.pdf) {
      var blob = Utilities.newBlob(
        Utilities.base64Decode(params.pdf),
        'application/pdf',
        orderId + '-invoice.pdf'
      );
      attachments.push(blob);
    }

    var html =
      '<div style="font-family:Arial,sans-serif;max-width:600px">' +
      '<h2 style="background:#1a143c;color:#ffd666;padding:12px 16px;margin:0">' + SHOP_NAME + '</h2>' +
      '<p><b>Order ID:</b> ' + orderId + '</p>' +
      '<p><b>Name:</b> ' + (params.name || '') + '<br>' +
      '<b>Mobile:</b> ' + (params.mobile || '') + '<br>' +
      '<b>Email:</b> ' + (params.email || '') + '<br>' +
      '<b>Address:</b> ' + (params.address || '') + ', ' + (params.district || '') + ', ' +
      (params.state || '') + ' - ' + (params.pincode || '') + '</p>' +
      '<p><b>Order Items:</b></p><pre style="background:#f6f6f6;padding:10px">' + items + '</pre>' +
      '<p><b>Total Qty:</b> ' + (params.totalQty || '') + '<br>' +
      '<b>MRP Total:</b> Rs ' + (params.mrpTotal || '') + '<br>' +
      '<b>Discount:</b> Rs ' + (params.discountAmount || '') + '<br>' +
      '<b>Net Total:</b> Rs ' + (params.totalAmount || '') + '</p>' +
      '<p>The full invoice is attached as a PDF.</p>' +
      '</div>';

    MailApp.sendEmail({
      to: SHOP_EMAIL,
      subject: 'New Order ' + orderId + ' - ' + (params.name || ''),
      htmlBody: html,
      attachments: attachments
    });

    if (params.email) {
      MailApp.sendEmail({
        to: params.email,
        subject: SHOP_NAME + ' - Order ' + orderId + ' received',
        htmlBody:
          '<p>Thank you for your order with ' + SHOP_NAME + '.</p>' + html,
        attachments: attachments
      });
    }
  } catch (mailErr) {
    // mailing must never break the order save
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
  }

  var headerRow = sheet.getRange(1, 1, 1, Math.max(sheet.getLastColumn(), HEADERS.length));
  if (String(headerRow.getValues()[0][HEADERS.length - 1] || '') !== 'Status') {
    sheet
      .getRange(1, HEADERS.length)
      .setValue('Status')
      .setFontWeight('bold')
      .setBackground('#f3e5c0');
  }

  if (sheet.getColumnWidth(10) < 200) {
    sheet.setColumnWidth(10, 320);
  }

  return sheet;
}

function listOrders_() {
  try {
    var sheet = getSheet_();
    var lastRow = sheet.getLastRow();
    if (lastRow < 2) return json_({ success: true, orders: [] });

    var values = sheet.getRange(2, 1, lastRow - 1, HEADERS.length).getValues();
    var orders = [];
    for (var i = values.length - 1; i >= 0; i--) {
      var r = values[i];
      orders.push({
        timestamp: r[0] ? Utilities.formatDate(new Date(r[0]), 'Asia/Kolkata', 'dd MMM yyyy, hh:mm a') : '',
        orderId: String(r[1] || ''),
        name: String(r[2] || ''),
        mobile: String(r[3] || ''),
        email: String(r[4] || ''),
        address: String(r[5] || ''),
        district: String(r[6] || ''),
        state: String(r[7] || ''),
        pincode: String(r[8] || ''),
        items: String(r[9] || ''),
        totalQty: String(r[10] || ''),
        totalAmount: String(r[13] || ''),
        status: String(r[14] || 'Confirmed')
      });
    }
    return json_({ success: true, orders: orders });
  } catch (err) {
    return json_({ success: false, error: String(err) });
  }
}

var STATUSES = ['Confirmed', 'In Transit', 'Delivered'];

function applyStatusValidation_(sheet, row) {
  var rule = SpreadsheetApp.newDataValidation()
    .requireValueInList(STATUSES, true)
    .setAllowInvalid(false)
    .build();
  sheet.getRange(row, HEADERS.length).setDataValidation(rule);
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(
    ContentService.MimeType.JSON
  );
}
