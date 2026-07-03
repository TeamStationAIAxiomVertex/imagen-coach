# Cloudflare DNS-AID Records

Domain: `coachdeimagen.com`

Purpose: DNS-based AI Discovery entrypoints for agent discovery scanners and validating resolvers.

Current blocker: the local Wrangler OAuth session has `zone:read` but not DNS record edit scope. Add these records in Cloudflare DNS for `coachdeimagen.com`.

## Records

```txt
_index._agents.coachdeimagen.com HTTPS 1 . alpn="h2" endpoint="https://coachdeimagen.com/.well-known/agent-index.json"
_a2a._agents.coachdeimagen.com HTTPS 1 . alpn="h2" endpoint="https://coachdeimagen.com/.well-known/a2a.json"
_mcp._agents.coachdeimagen.com HTTPS 1 . alpn="h2" endpoint="https://coachdeimagen.com/.well-known/mcp/server-card.json"
```

## Cloudflare Dashboard Fields

Use **DNS > Records > Add record**.

- Type: `HTTPS`
- Name: `_index._agents`
- Priority: `1`
- Target: `.`
- Parameters: `alpn="h2" endpoint="https://coachdeimagen.com/.well-known/agent-index.json"`

- Type: `HTTPS`
- Name: `_a2a._agents`
- Priority: `1`
- Target: `.`
- Parameters: `alpn="h2" endpoint="https://coachdeimagen.com/.well-known/a2a.json"`

- Type: `HTTPS`
- Name: `_mcp._agents`
- Priority: `1`
- Target: `.`
- Parameters: `alpn="h2" endpoint="https://coachdeimagen.com/.well-known/mcp/server-card.json"`

## Verification

```bash
dig +short HTTPS _index._agents.coachdeimagen.com
dig +short HTTPS _a2a._agents.coachdeimagen.com
dig +short HTTPS _mcp._agents.coachdeimagen.com
```

DNSSEC should remain enabled on the Cloudflare zone so DNS-AID records can be authenticated by validating resolvers.
