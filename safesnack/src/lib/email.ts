// Resend transactional email. No-ops cleanly when RESEND_API_KEY is unset (dev).
export async function sendEmail(to: string, subject: string, html: string) {
  const key = process.env.RESEND_API_KEY;
  if (!key) {
    console.log(`[email skipped — no RESEND_API_KEY] to=${to} subject="${subject}"`);
    return;
  }
  await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${key}` },
    body: JSON.stringify({ from: "SafeSnack <orders@safesnack.in>", to, subject, html }),
  }).catch((e) => console.error("email error", e));
}
