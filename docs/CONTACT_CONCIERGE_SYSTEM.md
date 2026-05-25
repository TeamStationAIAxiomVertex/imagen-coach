# Contact Concierge System

## Objective

The contact system is a static-first executive intake for Sonia McRorey. The visible page remains crawlable HTML at `/contacto/`; form submission is handled by Cloudflare Pages Functions at `/api/contact`.

## Runtime Flow

Static contact form -> Cloudflare Pages Function -> validation and antispam -> optional AI summary -> Cloudflare Email Service or Resend -> Sonia lead inbox.

The production function supports two outbound channels:

1. Cloudflare Email Service through a runtime `SONIA_LEAD_EMAIL` binding, if the binding is added outside `wrangler.jsonc`.
2. Resend through `RESEND_API_KEY`.

Cloudflare Email Service is preferred when the binding exists. Resend remains as a fallback for transactional sending.

Important Pages limitation verified on May 25, 2026: Cloudflare Pages configuration validation rejects `send_email` inside `wrangler.jsonc`:

```txt
Configuration file for Pages projects does not support "send_email"
```

Do not commit a `send_email` block to `wrangler.jsonc`; it breaks Pages deployment. If using native Cloudflare sending, configure it through a supported Pages dashboard binding if available, or move `/api/contact` to a separate Worker route that supports `send_email`.

## Required Secrets

Set these in the Cloudflare Pages project, never in client code.

Production project:

```txt
imagen-coach
```

Use Pages-specific secrets, not Worker-only `wrangler secret put` commands:

```bash
npx wrangler pages secret put RESEND_API_KEY --project-name imagen-coach
npx wrangler pages secret put LEAD_TO_EMAIL --project-name imagen-coach
npx wrangler pages secret put RESEND_FROM_EMAIL --project-name imagen-coach
npx wrangler pages secret put CLOUDFLARE_FROM_EMAIL --project-name imagen-coach
npx wrangler pages secret put OPENAI_API_KEY --project-name imagen-coach
npx wrangler pages secret put OPENAI_MODEL --project-name imagen-coach
```

`RESEND_API_KEY`, `RESEND_FROM_EMAIL`, `OPENAI_API_KEY` and `OPENAI_MODEL` are optional only when a working Cloudflare Email Service binding is active. If OpenAI is missing, the lead still sends and the email records that the AI concierge did not run.

Recommended Cloudflare Email Service values:

```txt
LEAD_TO_EMAIL=sonia@coachdeimagen.com
CLOUDFLARE_FROM_EMAIL=no-reply@coachdeimagen.com
```

The contact endpoint exposes a safe readiness check:

```bash
curl https://coachdeimagen.com/api/contact
```

Expected production state after secrets are installed:

```json
{
  "ok": true,
  "endpoint": "/api/contact",
  "email_configured": true,
  "email_channel": "cloudflare_email_service",
  "ai_concierge_configured": false
}
```

## Cloudflare KV

Create a KV namespace for IP rate limiting and bind it to the Pages project as `CONTACT_RATE_LIMIT`.
Do not commit placeholder KV IDs in `wrangler.jsonc`; Cloudflare Pages rejects invalid namespace IDs during deployment.
If the binding is absent, the contact function still deploys and uses the remaining validation, honeypot and sanitization controls.

```bash
wrangler kv namespace create CONTACT_RATE_LIMIT
wrangler kv namespace create CONTACT_RATE_LIMIT --preview
```

## Resend DNS

Use Resend domain verification for `send.coachdeimagen.com`. Add SPF, DKIM and DMARC records in Cloudflare DNS exactly as provided by Resend.

## Cloudflare Email Routing

`sonia@coachdeimagen.com` is the receiving inbox identity and forwards to Sonia's Gmail through Cloudflare Email Routing. This is the correct value for `LEAD_TO_EMAIL`.

Cloudflare Email Routing is inbound forwarding. It does not automatically make a form send email. The Pages Function needs either:

- a working `SONIA_LEAD_EMAIL` Email Service binding provided to the Pages Function runtime, or
- a verified Resend sender and `RESEND_API_KEY`.

Recommended Resend sender:

```txt
no-reply@send.coachdeimagen.com
```

Recommended inbox secrets:

```txt
LEAD_TO_EMAIL=sonia@coachdeimagen.com
RESEND_FROM_EMAIL=no-reply@send.coachdeimagen.com
```

If Sonia uses a different receiving inbox, set `LEAD_TO_EMAIL` to that inbox. The sender must remain a Resend-verified address.

## Security Controls

- Resend and OpenAI keys stay in Worker secrets.
- Cloudflare Email Service sending stays behind the Pages Function binding.
- Sonia's lead inbox is not exposed in HTML.
- The frontend never sends email directly.
- The endpoint validates email, service interest, body length and phone presence.
- Honeypot and timestamp checks block simple bot submissions.
- KV rate limit blocks repeated submissions per IP.
- Disposable email domains and excessive links are rejected.
- HTML is stripped from user input before email rendering.

## Future CRM Integration

The Worker can add non-blocking integrations through `context.waitUntil()` later:

- HubSpot
- Slack alerts
- Notion CRM
- Airtable
- Google Sheets
- Salesforce
- vector lead scoring

The static frontend should not change for those integrations.
