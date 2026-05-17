// ============================================================
//  Code.gs — Google Apps Script backend
//  Nasadit jako: Extensions → Apps Script → Deploy → Web App
//  Execute as: Me | Who has access: Anyone
// ============================================================

const SPREADSHEET_ID = 'VLOŽ_ID_SVÉHO_GOOGLE_SHEETU_SEM';
const NOTIFY_EMAIL   = 'email@tomas-vlcek.com';

function doGet(e) {
  const action = e.parameter.action || 'all';
  let result = {};

  if (action === 'all' || action === 'projects') {
    result.projects = getSheet('Projekty');
  }
  if (action === 'all' || action === 'articles') {
    result.articles = getSheet('Clanky');
  }
  if (action === 'all' || action === 'reviews') {
    result.reviews = getSheet('Recenze');
  }
  if (action === 'settings') {
    result.settings = getSettings();
  }

  return jsonResponse(result);
}

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    if (data.action === 'contact') {
      handleContactForm(data);
      return jsonResponse({ status: 'ok' });
    }
    return jsonResponse({ status: 'error', message: 'Unknown action' });
  } catch (err) {
    return jsonResponse({ status: 'error', message: err.message });
  }
}

// ── Read sheet rows as array of objects ──────────────────────
function getSheet(sheetName) {
  const ss    = SpreadsheetApp.openById(SPREADSHEET_ID);
  const sheet = ss.getSheetByName(sheetName);
  if (!sheet) return [];
  const [headers, ...rows] = sheet.getDataRange().getValues();
  return rows
    .filter(row => row[0]) // skip empty rows
    .filter(row => {
      const aktIdx = headers.indexOf('Aktivni');
      return aktIdx === -1 || String(row[aktIdx]).toLowerCase() !== 'ne';
    })
    .map((row, i) => {
      const obj = { id: i + 1 };
      headers.forEach((h, j) => {
        const key = String(h).toLowerCase()
          .replace(/á/g,'a').replace(/č/g,'c').replace(/é/g,'e')
          .replace(/í/g,'i').replace(/ó/g,'o').replace(/š/g,'s')
          .replace(/ú|ů/g,'u').replace(/ý/g,'y').replace(/ž/g,'z')
          .replace(/\s+/g,'_');
        obj[key] = row[j];
      });
      return obj;
    });
}

function getSettings() {
  const ss    = SpreadsheetApp.openById(SPREADSHEET_ID);
  const sheet = ss.getSheetByName('Nastaveni');
  if (!sheet) return {};
  const rows = sheet.getDataRange().getValues();
  const result = {};
  rows.slice(1).forEach(([key, cs, en]) => {
    if (key) result[key] = { cs, en };
  });
  return result;
}

// ── Handle contact form submission ───────────────────────────
function handleContactForm(data) {
  // Save to sheet
  const ss    = SpreadsheetApp.openById(SPREADSHEET_ID);
  let sheet   = ss.getSheetByName('Dotazy');
  if (!sheet) sheet = ss.insertSheet('Dotazy');
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(['Datum', 'Jméno', 'Email', 'Telefon', 'Zpráva']);
  }
  sheet.appendRow([new Date(), data.name, data.email, data.phone || '', data.message]);

  // Send email notification
  GmailApp.sendEmail(
    NOTIFY_EMAIL,
    `Nový dotaz z webu od ${data.name}`,
    `Jméno: ${data.name}\nEmail: ${data.email}\nTelefon: ${data.phone || '—'}\n\nZpráva:\n${data.message}`,
    {
      htmlBody: `
        <h2 style="font-family:sans-serif;color:#9B7D4F;">Nový dotaz z webu</h2>
        <p><strong>Jméno:</strong> ${data.name}</p>
        <p><strong>Email:</strong> <a href="mailto:${data.email}">${data.email}</a></p>
        <p><strong>Telefon:</strong> ${data.phone || '—'}</p>
        <hr>
        <p><strong>Zpráva:</strong></p>
        <p>${data.message.replace(/\n/g,'<br>')}</p>
      `
    }
  );
}

function jsonResponse(data) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}
