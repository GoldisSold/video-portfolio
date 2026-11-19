import nodemailer from 'nodemailer';
import { NextResponse } from 'next/server';

type EnquiryPayload = {
  name?: unknown;
  email?: unknown;
  whatsapp?: unknown;
  projectType?: unknown;
  message?: unknown;
  website?: unknown;
};

function text(value: unknown, maxLength: number) {
  return typeof value === 'string' ? value.trim().slice(0, maxLength) : '';
}

export async function POST(request: Request) {
  let payload: EnquiryPayload;
  try {
    payload = await request.json() as EnquiryPayload;
  } catch {
    return NextResponse.json({ error: 'Invalid enquiry data.' }, { status: 400 });
  }

  // Quietly accept the hidden honeypot field to avoid confirming bot detection.
  if (text(payload.website, 200)) return NextResponse.json({ ok: true });

  const name = text(payload.name, 120);
  const email = text(payload.email, 320);
  const whatsapp = text(payload.whatsapp, 80);
  const projectType = text(payload.projectType, 120).replace(/[\r\n]+/g, ' ');
  const message = text(payload.message, 6000);

  if (!name || !email || !projectType || !message || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: 'Please check the required fields and try again.' }, { status: 400 });
  }

  const sender = process.env.GMAIL_USER;
  const appPassword = process.env.GMAIL_APP_PASSWORD;
  const recipient = process.env.CONTACT_TO_EMAIL || sender;
  if (!sender || !appPassword || !recipient) {
    return NextResponse.json({ error: 'Email delivery is not configured yet. Please contact us directly.' }, { status: 503 });
  }

  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: { user: sender, pass: appPassword.replace(/\s/g, '') },
    });
    await transporter.sendMail({
      from: `GOLD RENDERS <${sender}>`,
      to: recipient,
      replyTo: email,
      subject: `Video project enquiry — ${projectType}`,
      text: [
        `Name: ${name}`,
        `Email: ${email}`,
        `WhatsApp: ${whatsapp || 'Not provided'}`,
        `Project type: ${projectType}`,
        '',
        'Project details:',
        message,
      ].join('\n'),
    });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: 'We could not send your enquiry just now. Please try again later.' }, { status: 502 });
  }
}
