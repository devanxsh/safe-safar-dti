"use strict";

const nodemailer = require("nodemailer");

// ─── SMTP transporter ─────────────────────────────────────────────────────────

function createTransporter() {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT ?? 587),
    secure: Number(process.env.SMTP_PORT) === 465, // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
}

const FROM = process.env.EMAIL_FROM ?? "SafeSafar <noreply@safesafar.app>";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function baseTemplate(title, bodyContent) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${title}</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; background: #f5f7fa; margin: 0; padding: 0; }
    .wrapper { max-width: 600px; margin: 40px auto; background: #fff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.06); }
    .header { background: #1A365D; color: #fff; padding: 32px 40px; text-align: center; }
    .header h1 { margin: 0; font-size: 28px; font-weight: 700; }
    .header p { margin: 8px 0 0; opacity: 0.8; font-size: 14px; }
    .body { padding: 32px 40px; color: #333; line-height: 1.6; }
    .footer { background: #f0f4f8; padding: 20px 40px; text-align: center; color: #888; font-size: 12px; }
    .badge { display: inline-block; background: #FFC107; color: #1A365D; padding: 4px 10px; border-radius: 6px; font-weight: 600; font-size: 13px; }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="header">
      <h1>🚌 SafeSafar</h1>
      <p>Smart Commuting, Safe Journey</p>
    </div>
    <div class="body">${bodyContent}</div>
    <div class="footer">© ${new Date().getFullYear()} SafeSafar. All rights reserved.</div>
  </div>
</body>
</html>`;
}

// ─── Email senders ────────────────────────────────────────────────────────────

/**
 * Send a contact / support form submission to the support inbox.
 */
async function sendContactEmail({ name, email, subject, message }) {
  const transporter = createTransporter();
  const html = baseTemplate(
    "New Contact Form Submission",
    `<h2>New message from ${name}</h2>
     <p><strong>Email:</strong> ${email}</p>
     <p><strong>Subject:</strong> ${subject}</p>
     <p><strong>Message:</strong></p>
     <p>${message.replace(/\n/g, "<br/>")}</p>`
  );

  await transporter.sendMail({
    from: FROM,
    to: process.env.SMTP_USER, // send to support inbox
    replyTo: email,
    subject: `[SafeSafar Support] ${subject}`,
    html,
  });
}

/**
 * Send a trip progress alert to the user's email.
 */
async function sendTripAlertEmail({ email, routeNumber, nextStop, eta }) {
  const transporter = createTransporter();
  const html = baseTemplate(
    "Trip Alert",
    `<h2>Your bus is arriving soon! 🚌</h2>
     <p>Your tracked bus <span class="badge">${routeNumber}</span> is approaching your stop.</p>
     <ul>
       <li><strong>Next stop:</strong> ${nextStop}</li>
       <li><strong>ETA:</strong> ${eta} minutes</li>
     </ul>
     <p>Please make your way to the bus stop now. Have a safe journey!</p>`
  );

  await transporter.sendMail({
    from: FROM,
    to: email,
    subject: `SafeSafar — ${routeNumber} arriving in ${eta} min`,
    html,
  });
}

/**
 * Send an emergency location alert.
 */
async function sendEmergencyAlertEmail({ email, location, message }) {
  const transporter = createTransporter();
  const mapsUrl = `https://www.google.com/maps?q=${location.lat},${location.lng}`;
  const html = baseTemplate(
    "🆘 Emergency Alert",
    `<h2 style="color:#c0392b;">Emergency Alert</h2>
     <p>${message ?? "A SafeSafar user has triggered an emergency alert."}</p>
     <p>
       <strong>Last known location:</strong><br/>
       Latitude: ${location.lat}<br/>
       Longitude: ${location.lng}
     </p>
     <p><a href="${mapsUrl}" style="color:#1A365D;">View on Google Maps →</a></p>
     <p><strong>Emergency contacts:</strong> Police: 100 | Ambulance: 108 | Bus Helpline: 1950</p>`
  );

  await transporter.sendMail({
    from: FROM,
    to: email,
    subject: "🆘 SafeSafar Emergency Alert",
    html,
  });
}

module.exports = { sendContactEmail, sendTripAlertEmail, sendEmergencyAlertEmail };
