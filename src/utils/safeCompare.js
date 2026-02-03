import crypto from 'crypto';

export function safeCompare(a, b) {
  if (!a || !b) return false;

  const ba = Buffer.from(String(a));
  const bb = Buffer.from(String(b));

  if (ba.length !== bb.length) return false;
  return crypto.timingSafeEqual(ba, bb);
}
