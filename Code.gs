const SHEET_TITLE = "Questionnaire Responses";
const SHEET_TAB = "Responses";
const SPREADSHEET_ID_PROPERTY = "RESPONSE_SPREADSHEET_ID";
const ANSWER_HEADERS = [
  "Date plan",
  "Sitcom title",
  "Couple snack",
  "Tiny adventure",
  "Entrance song",
  "Tiny thing loved",
  "Relationship superpower",
  "Plan together"
];

function setup() {
  const properties = PropertiesService.getScriptProperties();
  const savedId = properties.getProperty(SPREADSHEET_ID_PROPERTY);
  const spreadsheet = savedId
    ? SpreadsheetApp.openById(savedId)
    : SpreadsheetApp.create(SHEET_TITLE);

  if (!savedId) {
    properties.setProperty(SPREADSHEET_ID_PROPERTY, spreadsheet.getId());
  }

  let sheet = spreadsheet.getSheetByName(SHEET_TAB);
  if (!sheet) {
    sheet = spreadsheet.insertSheet(SHEET_TAB);
  }
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(["Submitted at", ...ANSWER_HEADERS]);
  }

  console.log(`Response spreadsheet: ${spreadsheet.getUrl()}`);
}

function doPost(event) {
  try {
    const spreadsheetId = PropertiesService.getScriptProperties()
      .getProperty(SPREADSHEET_ID_PROPERTY);
    if (!spreadsheetId) {
      throw new Error("Run setup before accepting responses.");
    }

    const payload = JSON.parse(event.postData.contents);
    if (!Array.isArray(payload.answers) || payload.answers.length !== ANSWER_HEADERS.length) {
      throw new Error("Expected exactly eight answers.");
    }

    const lock = LockService.getScriptLock();
    lock.waitLock(10000);
    try {
      const sheet = SpreadsheetApp.openById(spreadsheetId).getSheetByName(SHEET_TAB);
      if (!sheet) {
        throw new Error("The Responses tab is missing. Run setup again.");
      }

      const answers = payload.answers.map((answer) => {
        const value = String(answer || "").slice(0, 500);
        return /^[=+\-@]/.test(value) ? `'${value}` : value;
      });
      sheet.appendRow([new Date(), ...answers]);
    } finally {
      lock.releaseLock();
    }

    return jsonResponse({ ok: true });
  } catch (error) {
    console.error(error);
    return jsonResponse({ ok: false, error: "Could not save the response." });
  }
}

function jsonResponse(value) {
  return ContentService
    .createTextOutput(JSON.stringify(value))
    .setMimeType(ContentService.MimeType.JSON);
}