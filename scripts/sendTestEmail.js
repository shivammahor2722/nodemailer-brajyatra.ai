require('dotenv').config();
const transporter = require('../config/mail');
const fs = require('fs');
const path = require('path');

const templatePath = path.join(__dirname, '..', 'templates', 'email.html');
let tpl = '';
try {
  tpl = fs.readFileSync(templatePath, 'utf8');
} catch (e) {
  tpl = null;
}

function render(data) {
  if (!tpl) {
    return `<h2>${data.subject}</h2><p>${data.message}</p>`;
  }
  let out = tpl;
  const map = {
    subject: data.subject || '',
    message: data.message || '',
    recipient: data.recipient || '',
    siteName: data.siteName || 'Brajyatra.AI',
  };
  Object.keys(map).forEach((k) => {
    out = out.replace(new RegExp('{{\\s*' + k + '\\s*}}','g'), map[k]);
  });
  return out;
}

async function main() {
  const to = process.argv[2] || process.env.EMAIL_TO || process.env.EMAIL_USER || 'recipient@example.com';
  const subject = process.argv[3] || 'Test from Brajyatra.AI';
  const message = process.argv[4] || 'This is a test message from Brajyatra.AI';

  const html = render({ subject, message, recipient: 'Tester', siteName: 'Brajyatra.AI' });

  try {
    const info = await transporter.sendMail({
      from: `"Brajyatra.AI" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    });
    console.log('Email sent:', info && info.messageId ? info.messageId : info);
    process.exit(0);
  } catch (err) {
    console.error('Send failed:', err && err.message ? err.message : err);
    process.exit(2);
  }
}

main();
