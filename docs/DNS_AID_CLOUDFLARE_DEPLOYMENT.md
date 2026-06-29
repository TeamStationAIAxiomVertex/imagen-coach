# DNS-AID Cloudflare Deployment

## Purpose

Publish DNS for AI Discovery (DNS-AID) records for `coachdeimagen.com` without misrepresenting the site's current capabilities.

This domain currently exposes:

- public static HTTPS content
- agent discovery metadata
- an organization-level agent index
- OAuth-style discovery metadata for anonymous/public access

This domain does **not** currently expose:

- a live A2A endpoint
- a live remote MCP tool endpoint
- bearer-token protected agent APIs

Do not publish DNS-AID records that imply protocols the site does not actually serve.

## Site-side discovery endpoints

- `https://coachdeimagen.com/.well-known/agent-index.json`
- `https://coachdeimagen.com/.well-known/agent.json`
- `https://coachdeimagen.com/.well-known/api-catalog`
- `https://coachdeimagen.com/.well-known/mcp/server-card.json`
- `https://coachdeimagen.com/auth.md`

## Required DNS-AID record now

Publish the organization index entrypoint:

```dns
_index._agents.coachdeimagen.com. 3600 IN HTTPS 1 coachdeimagen.com. (
  alpn="h2,h3"
  port=443
  well-known="/.well-known/agent-index.json"
)
```

### Cloudflare DNS mapping

- Type: `HTTPS`
- Name: `_index._agents`
- Priority: `1`
- Target: `coachdeimagen.com`
- Parameters:
  - `alpn="h2,h3"`
  - `port=443`
  - `well-known="/.well-known/agent-index.json"`

## Optional direct leaf record

If you want a direct leaf discovery record for the root site, publish:

```dns
coachdeimagen.com. 3600 IN HTTPS 1 coachdeimagen.com. (
  alpn="h2,h3"
  port=443
  well-known="/.well-known/agent.json"
)
```

This does **not** advertise A2A or remote MCP execution. It only advertises HTTPS discovery metadata.

## Do not publish yet

Do **not** publish `_a2a._agents` or `alpn="a2a"` until a real A2A service exists.

Do **not** publish `alpn="mcp"` until a real MCP transport endpoint exists. A static MCP server card alone is not a live MCP runtime.

## DNSSEC requirement

Enable DNSSEC for `coachdeimagen.com` in Cloudflare DNS.

DNS-AID trust is materially stronger when:

- the zone is DNSSEC-signed
- resolvers can validate the chain of trust
- bogus or unverifiable agent discovery records are rejected

## Operational rule

Any future DNS-AID record must map to a real endpoint already deployed on the site. Discovery records are allowed to lead discovery. They are not allowed to fabricate capabilities.
