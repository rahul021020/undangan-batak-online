/**
 * RSVP ONLINE - NARUTO & HINATA
 * Google Apps Script -> Google Sheets
 *
 * SPREADSHEET_ID sudah diset ke spreadsheet undangan.
 * Deploy sebagai Web app:
 * Execute as: Me
 * Who has access: Anyone
 */

const SPREADSHEET_ID = '1jE9GEPICo3u0Us5AO28b7jb1CHXeN_B0ya-l9aoKT1M';
const SHEET_NAME = 'RSVP';

function getSpreadsheet_() {
  return SpreadsheetApp.openById(SPREADSHEET_ID);
}

function getSheet_() {
  const ss = getSpreadsheet_();
  let sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) sheet = ss.insertSheet(SHEET_NAME);

  if (sheet.getLastRow() === 0) {
    sheet.appendRow(['Waktu', 'Nama', 'Kehadiran', 'Ucapan']);
    sheet.setFrozenRows(1);
  }
  return sheet;
}

function json_(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

function doGet(e) {
  try {
    const sheet = getSheet_();
    const lastRow = sheet.getLastRow();
    const rows = [];

    if (lastRow >= 2) {
      // Ambil 100 ucapan terbaru.
      const startRow = Math.max(2, lastRow - 99);
      const count = lastRow - startRow + 1;
      const values = sheet.getRange(startRow, 1, count, 4).getValues();

      for (let i = values.length - 1; i >= 0; i--) {
        const row = values[i];
        rows.push({
          timestamp: row[0] instanceof Date ? row[0].toISOString() : String(row[0] || ''),
          name: String(row[1] || ''),
          attendance: String(row[2] || ''),
          message: String(row[3] || '')
        });
      }
    }

    const payload = {
      ok: true,
      data: rows
    };

    // JSONP untuk dibaca dari localhost/Vercel tanpa CORS.
    const callback = e && e.parameter ? String(e.parameter.callback || '') : '';
    if (callback) {
      const safeCallback = callback.replace(/[^A-Za-z0-9_$\.]/g, '');
      return ContentService
        .createTextOutput(safeCallback + '(' + JSON.stringify(payload) + ');')
        .setMimeType(ContentService.MimeType.JAVASCRIPT);
    }

    return json_(payload);
  } catch (err) {
    const payload = { ok: false, data: [], message: String(err) };
    const callback = e && e.parameter ? String(e.parameter.callback || '') : '';
    if (callback) {
      const safeCallback = callback.replace(/[^A-Za-z0-9_$\.]/g, '');
      return ContentService
        .createTextOutput(safeCallback + '(' + JSON.stringify(payload) + ');')
        .setMimeType(ContentService.MimeType.JAVASCRIPT);
    }
    return json_(payload);
  }
}

function doPost(e) {
  try {
    const p = e && e.parameter ? e.parameter : {};
    const name = String(p.name || '').trim().slice(0, 100);
    const attendance = String(p.attendance || '').trim().slice(0, 30);
    const message = String(p.message || '').trim().slice(0, 500);

    if (!name || !attendance || !message) {
      return json_({ ok: false, message: 'Data RSVP belum lengkap.' });
    }

    const sheet = getSheet_();
    sheet.appendRow([new Date(), name, attendance, message]);
    SpreadsheetApp.flush();

    return json_({ ok: true, message: 'Ucapan berhasil disimpan.' });
  } catch (err) {
    return json_({ ok: false, message: String(err) });
  }
}

// Jalankan sekali secara manual jika ingin memastikan sheet/header dibuat.
function setupSheet() {
  getSheet_();
}
