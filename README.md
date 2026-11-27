# Srilekha & Srinivas Teja — wedding invite

10 December 2026 · 8:18 AM · Ukku Kala Vedika, Jaggaiahpeta
Live: https://ajay-dev-19.github.io/bro-wedding/

A plain static site, with no build step:

- `index.html`: the whole invite (text, styles, animations, English/Telugu switch)
- `rosewood/`: images
- `lenis.min.js`: smooth scrolling on laptops

Pushing to `main` publishes it to GitHub Pages automatically.

## Editing text
All English and Telugu wording is in the `T = { en: {...}, te: {...} }` block near the bottom of `index.html`.
The countdown target is `WEDDING_AT`.

## Preview locally
Open `index.html` in a browser, or run `python3 -m http.server` in this folder and visit http://localhost:8000.

## RSVPs → Google Sheet

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
5. Open `index.html`, find `const SHEET_URL = "";` and paste the URL between the quotes.
6. Commit and push. Every RSVP now lands as a new row.

If you later edit the script, use **Deploy → Manage deployments → Edit → New version** so the same URL keeps working.
