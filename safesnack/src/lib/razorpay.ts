import crypto from "node:crypto";

const BASE = "https://api.razorpay.com/v1";

export async function createRazorpayOrder(amountPaise: number, receipt: string) {
  const key = process.env.RAZORPAY_KEY_ID;
  const secret = process.env.RAZORPAY_KEY_SECRET;
  if (!key || !secret) throw new Error("Razorpay keys not configured");
  const res = await fetch(`${BASE}/orders`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Basic " + Buffer.from(`${key}:${secret}`).toString("base64"),
    },
    body: JSON.stringify({ amount: amountPaise, currency: "INR", receipt }),
  });
  if (!res.ok) throw new Error("Razorpay order failed: " + (await res.text()));
  return (await res.json()) as { id: string };
}

function safeEqual(a: string, b: string) {
  const ba = Buffer.from(a);
  const bb = Buffer.from(b);
  return ba.length === bb.length && crypto.timingSafeEqual(ba, bb);
}

export function verifyPaymentSignature(orderId: string, paymentId: string, signature: string) {
  const secret = process.env.RAZORPAY_KEY_SECRET;
  if (!secret) return false;
  const expected = crypto.createHmac("sha256", secret).update(`${orderId}|${paymentId}`).digest("hex");
  return safeEqual(expected, signature);
}

export function verifyWebhook(rawBody: string, signature: string) {
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
  if (!secret) return false;
  const expected = crypto.createHmac("sha256", secret).update(rawBody).digest("hex");
  return safeEqual(expected, signature);
}
