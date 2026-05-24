# Contact Concierge System

## Objective

The contact system is a static-first executive intake for Sonia McRorey. The visible page remains crawlable HTML at `/contacto/`; form submission is handled by Cloudflare Pages Functions at `/api/contact`.

## Runtime Flow

Static contact form -> Cloudflare Pages Function -> validation and antispam -> optional AI summary -> Resend email -> Sonia lead inbox.

## Required Secrets

Set these in Cloudflare, never in client code:

```bash
wrangler secret put RESEND_API_KEY
wrangler secret put LEAD_TO_EMAIL
wrangler secret put RESEND_FROM_EMAIL
wrangler secret put OPENAI_API_KEY
wrangler secret put OPENAI_MODEL
```

`OPENAI_API_KEY` and `OPENAI_MODEL` are optional. If either is missing, the lead still sends and the email records that the AI concierge did not run.

## Cloudflare KV

Create a KV namespace for IP rate limiting and bind it to the Pages project as `CONTACT_RATE_LIMIT`.
Do not commit placeholder KV IDs in `wrangler.jsonc`; Cloudflare Pages rejects invalid namespace IDs during deployment.
If the binding is absent, the contact function still deploys and uses the remaining validation, honeypot and sanitization controls.

```bash
wrangler kv namespace create CONTACT_RATE_LIMIT
wrangler kv namespace create CONTACT_RATE_LIMIT --preview
```

## Resend DNS

Use Resend domain verification for `send.imagencoach.com` or the final production sending subdomain. Add SPF, DKIM and DMARC records in Cloudflare DNS as provided by Resend.

Recommended sender:

```txt
no-reply@send.imagencoach.com
```

Recommended inbox secrets:

```txt
LEAD_TO_EMAIL=sonia@imagencoach.com
RESEND_FROM_EMAIL=no-reply@send.imagencoach.com
```

## Security Controls

- Resend and OpenAI keys stay in Worker secrets.
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
