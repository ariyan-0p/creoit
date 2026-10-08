/**
 * POST /api/contact — receives the brief from the contact page.
 *
 * Defence: size cap, honeypot, minimum fill time, per-IP rate limit, strict
 * validation, header-injection-safe email. Every accepted brief is appended to
 * a JSONL file on the server first (so nothing is ever lost), then emailed if
 * SMTP is configured through environment variables:
 *
 *   SMTP_HOST, SMTP_PORT (465 = TLS), SMTP_USER, SMTP_PASS
 *   CONTACT_TO   (where briefs go, default team@creoit.in)
 *   CONTACT_FROM (sender, default = SMTP_USER)
 *   CONTACT_DIR  (storage folder, default /var/lib/creoit, else ./data)
 *   LEADS_API_URL, LEADS_INGEST_KEY  (also hand the brief to the CREOIT API so the team sees it in the admin panel)
 */

import { appendFile, mkdir } from "node:fs/promises";
import path from "node:path";
import nodemailer from "nodemailer";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_BODY = 20_000;
const hits = new Map<string, number[]>();

function limited(ip: string) {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < 10 * 60_000);
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 5000) hits.clear();
  return recent.length > 5; // 5 briefs per 10 minutes per address
}

const clean = (v: unknown, max: number) =>
  (typeof v === "string" ? v : "").replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f]/g, "").trim().slice(0, max);
const oneLine = (s: string) => s.replace(/[\r\n]+/g, " ");

async function store(entry: object) {
  const dirs = [process.env.CONTACT_DIR, "/var/lib/creoit", path.join(process.cwd(), "data")].filter(Boolean) as string[];
  for (const dir of dirs) {
    try {
      await mkdir(dir, { recursive: true });
      await appendFile(path.join(dir, "briefs.jsonl"), JSON.stringify(entry) + "\n", { mode: 0o600 });
      return true;
    } catch {
      /* try the next folder */
    }
  }
  return false;
}

/** Hand the brief to the admin panel's database. Best effort: the file above is the safety net. */
async function forward(b: Record<string, string>) {
  const { LEADS_API_URL, LEADS_INGEST_KEY } = process.env;
  if (!LEADS_API_URL || !LEADS_INGEST_KEY) return false;
  const res = await fetch(LEADS_API_URL, {
    method: "POST",
    headers: { "content-type": "application/json", "x-leads-key": LEADS_INGEST_KEY },
    body: JSON.stringify(b),
    signal: AbortSignal.timeout(4000),
  });
  if (!res.ok) throw new Error(`leads intake answered ${res.status}`);
  return true;
}

async function mail(b: Record<string, string>) {
  const { SMTP_HOST, SMTP_USER, SMTP_PASS } = process.env;
  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) return false;
  const port = Number(process.env.SMTP_PORT ?? 465);
  const t = nodemailer.createTransport({ host: SMTP_HOST, port, secure: port === 465, auth: { user: SMTP_USER, pass: SMTP_PASS } });
  const to = process.env.CONTACT_TO ?? "team@creoit.in";
  await t.sendMail({
    from: `"CREOIT website" <${process.env.CONTACT_FROM ?? SMTP_USER}>`,
    to,
    replyTo: b.email,
    subject: oneLine(`New brief — ${b.company} (${b.name})`),
    text: [
      `Name: ${b.name}`,
      `Company / brand: ${b.company}`,
      `Email: ${b.email}`,
      ...(b.phone ? [`Phone: ${b.phone}`] : []),
      `Interested in: ${b.interests || "—"}`,
      `Budget: ${b.budget || "—"}`,
      "",
      b.message,
    ].join("\n"),
  });
  return true;
}

export async function POST(req: Request) {
  const raw = await req.text();
  if (raw.length > MAX_BODY) return Response.json({ ok: false, error: "Too large." }, { status: 413 });

  let data: Record<string, unknown>;
  try {
    data = JSON.parse(raw);
  } catch {
    return Response.json({ ok: false, error: "Bad request." }, { status: 400 });
  }

  // bots: the hidden field is filled, or the form was "completed" in under 2 seconds
  const elapsed = Date.now() - Number(data.t ?? 0);
  if (clean(data.website, 100) || !(elapsed > 2000)) return Response.json({ ok: true }); // pretend success

  const ip = (req.headers.get("x-real-ip") ?? req.headers.get("x-forwarded-for")?.split(",")[0] ?? "unknown").trim();
  if (limited(ip)) return Response.json({ ok: false, error: "Too many briefs just now. Please try again in a few minutes." }, { status: 429 });

  const interests = Array.isArray(data.interests) ? data.interests.slice(0, 12).map((i) => clean(i, 40)).filter(Boolean).join(", ") : "";
  const b = {
    name: oneLine(clean(data.name, 120)),
    company: oneLine(clean(data.company, 160)),
    email: oneLine(clean(data.email, 200)),
    phone: oneLine(clean(data.phone, 40)),
    interests,
    budget: oneLine(clean(data.budget, 40)),
    message: clean(data.message, 5000),
  };
  if (!b.name || !b.company || !b.message || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(b.email)) {
    return Response.json({ ok: false, error: "Please check the highlighted fields." }, { status: 422 });
  }

  const saved = await store({ at: new Date().toISOString(), ip, ...b });
  let forwarded = false;
  try {
    forwarded = await forward(b);
  } catch (e) {
    console.error("contact forward failed", e);
  }
  let mailed = false;
  try {
    mailed = await mail(b);
  } catch (e) {
    console.error("contact mail failed", e);
  }

  if (!saved && !mailed && !forwarded) return Response.json({ ok: false, error: "Something went wrong on our side. Please email us directly." }, { status: 500 });
  return Response.json({ ok: true });
}
