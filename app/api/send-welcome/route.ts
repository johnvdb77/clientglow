import { Resend } from 'resend';
import { NextResponse } from 'next/server';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    await resend.emails.send({
      from: 'ClientGlow <onboarding@resend.dev>',
      to: email,
      subject: 'Welcome to ClientGlow! 🎉',
      html: `
        <h1>You're on the waitlist! ✨</h1>
        <p>Thanks for joining ClientGlow. We'll let you know as soon as we launch!</p>
        <p>Get ready to make your clients glow.</p>
        <p>- The ClientGlow Team</p>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Email error:', error);
    return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
  }
}