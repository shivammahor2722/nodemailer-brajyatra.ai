# Travel Companion — Backend

Purpose: Backend for the Travel Itinerary Companion web app. It provides APIs to manage itineraries and sends user notifications and contact emails using Nodemailer.

Role of Nodemailer
- Handles all outgoing emails (notifications, contact queries, confirmations).
- Configured in `config/mail.js` and exposed via `/api/email/send`.

Quick setup
1. Install dependencies:

```bash
npm install
```

2. Create a `.env` (already ignored by git). Example:

```
EMAIL_USER=youremail@gmail.com
EMAIL_PASS=your_app_password
```

Notes:
- For Gmail use an App Password (recommended) or enable access per Google settings.
- Never commit `.env` — it's listed in `.gitignore`.

Run

```bash
node index.js
```

Email endpoint
- POST `http://localhost:5000/api/email/send`
- Body (JSON):

```json
{
  "to": "user@example.com",
  "subject": "Trip Confirmed 🎉",
  "message": "Your Goa trip is confirmed for 15 March. Have a safe journey!"
}
```

Test examples
- curl:

```bash
curl -X POST http://localhost:5000/api/email/send \
  -H "Content-Type: application/json" \
  -d '{"to":"user@example.com","subject":"Test","message":"Hello"}'
```

- PowerShell:

```powershell
$body = @{ to='user@example.com'; subject='Test'; message='Hello' } | ConvertTo-Json
Invoke-RestMethod -Uri 'http://localhost:5000/api/email/send' -Method Post -ContentType 'application/json' -Body $body
```

Client usage (fetch):

```js
await fetch('http://localhost:5000/api/email/send', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ to: userEmail, subject: 'Your Trip Details', message: 'Thanks for booking with us!' })
});
```


If you'd like, I can add a `start` script to `package.json` or create a short `README` section about production deployment.

Contact feature
- POST `/api/contact/send` — public contact form that emails the admin (no storage).

Environment variables
- `EMAIL_USER`, `EMAIL_PASS` — for Nodemailer

