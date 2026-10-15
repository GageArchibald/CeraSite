# CeraSite

A playful, one-page questionnaire for your girlfriend. Responses are saved to a Google Sheet through Google Apps Script.

## Google Sheets setup

1. Open [script.google.com](https://script.google.com) and create a new Apps Script project.
2. Replace the starter contents of `Code.gs` with the code in this project's `Code.gs` file, then save.
3. Select `setup` in the function menu and click **Run**. Approve Google's permission prompt. This creates a spreadsheet named **Questionnaire Responses** with a **Responses** tab. Find its link in the execution log.
4. Click **Deploy** > **New deployment**, choose **Web app**, set **Execute as** to **Me**, and set access to **Anyone**. Deploy and approve any prompts.
5. Copy the web app URL ending in `/exec` into `SHEETS_CONFIG.webAppUrl` in `index.html`, replacing `YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL`.
6. Open `index.html` and submit a test. Each submission adds a timestamp and the eight answers as a new row in the **Responses** tab.

The web app endpoint is public so the page can submit without requiring your girlfriend to sign in. Anyone with the endpoint URL can submit rows to the sheet, so only share the page with people you trust. Google may restrict public web app deployments for managed accounts.
