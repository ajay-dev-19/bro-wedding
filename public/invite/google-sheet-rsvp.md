# RSVPs → Google Sheet (one-time setup, ~3 minutes)

1. Create a new Google Sheet (e.g. "Srinivas Teja wedding RSVPs").
2. In the sheet: **Extensions → Apps Script**. Delete what's there and paste this:

```js
function doPost(e) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(["Time", "Name", "Attending", "Guests", "Events", "Language"]);
  }
  const p = e.parameter;
  sheet.appendRow([new Date(), p.name, p.attending, Number(p.guests) || 0, p.events, p.language]);
  return ContentService.createTextOutput("ok");
}
```

3. Click **Deploy → New deployment** → type **Web app**.
   - Execute as: **Me**
   - Who has access: **Anyone**
4. Click **Deploy**, allow the permissions, and copy the **Web app URL**
   (looks like `https://script.google.com/macros/s/AKfy.../exec`).
5. Open `public/invite/index.html`, find `const SHEET_URL = "";` and paste the URL between the quotes.
6. Commit and push. Every RSVP now lands as a new row.

If you later edit the script, use **Deploy → Manage deployments → Edit → New version** so the same URL keeps working.
