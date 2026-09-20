const DIRECTORY_PATH = "/.well-known/http-message-signatures-directory";
const DIRECTORY_CONTENT_TYPE = "application/http-message-signatures-directory+json";
const DIRECTORY_TAG = "http-message-signatures-directory";
const ONE_DAY_SECONDS = 24 * 60 * 60;

function base64Url(buffer) {
  const bytes = buffer instanceof ArrayBuffer ? new Uint8Array(buffer) : buffer;
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replaceAll("+", "-").replaceAll("/", "_").replace(/=+$/g, "");
}

function base64Standard(buffer) {
  const bytes = buffer instanceof ArrayBuffer ? new Uint8Array(buffer) : buffer;
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary);
}

function parseJwk(raw, label) {
  if (!raw) return null;
  try {
    const jwk = typeof raw === "string" ? JSON.parse(raw) : raw;
    if (jwk?.kty !== "OKP" || jwk?.crv !== "Ed25519" || !jwk?.x) {
      throw new Error(`${label} must be an Ed25519 OKP JWK with kty, crv and x`);
    }
    return jwk;
  } catch (error) {
    throw new Error(`Invalid ${label}: ${error.message}`);
  }
}

function publicJwkFrom(privateJwk, configuredPublicJwk) {
  const publicJwk = configuredPublicJwk || privateJwk;
  const { kty, crv, x, kid } = publicJwk;
  const clean = { kty, crv, x };
  if (kid) clean.kid = kid;
  return clean;
}

async function thumbprint(publicJwk) {
  const canonical = JSON.stringify({ crv: publicJwk.crv, kty: publicJwk.kty, x: publicJwk.x });
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(canonical));
  return base64Url(digest);
}

function signingJwkFrom(privateJwk) {
  const { kty, crv, x, d } = privateJwk;
  return { kty, crv, x, d, ext: true, key_ops: ["sign"] };
}

async function signDirectory({ request, privateJwk, publicJwk }) {
  if (!privateJwk.d) throw new Error("WEB_BOT_AUTH_PRIVATE_JWK must include the private Ed25519 d parameter");

  const now = Math.floor(Date.now() / 1000);
  const expires = now + ONE_DAY_SECONDS;
  const keyid = await thumbprint(publicJwk);
  const nonce = base64Standard(crypto.getRandomValues(new Uint8Array(48)));
  const host = new URL(request.url).host;
  const signatureParams = `("@authority";req);alg="ed25519";keyid="${keyid}";nonce="${nonce}";tag="${DIRECTORY_TAG}";created=${now};expires=${expires}`;
  const signatureBase = `"@authority";req: ${host}\n"@signature-params": ${signatureParams}`;
  const key = await crypto.subtle.importKey("jwk", signingJwkFrom(privateJwk), { name: "Ed25519" }, false, ["sign"]);
  const signature = await crypto.subtle.sign("Ed25519", key, new TextEncoder().encode(signatureBase));

  return {
    body: JSON.stringify({ keys: [publicJwk] }, null, 2),
    headers: {
      "content-type": DIRECTORY_CONTENT_TYPE,
      "cache-control": "public, max-age=300, stale-while-revalidate=86400",
      "signature-input": `sig1=${signatureParams}`,
      signature: `sig1=:${base64Standard(signature)}:`,
    },
  };
}

function fallbackDirectoryResponse(request) {
  const body = JSON.stringify({
    schemaVersion: "2026-05-24",
    origin: "https://coachdeimagen.com",
    status: "public-content-no-request-signing-required",
    keys: [],
    protectedResources: [],
    documentation: "https://coachdeimagen.com/openapi.json",
    contact: "https://coachdeimagen.com/contacto",
  }, null, 2);
  return new Response(request.method === "HEAD" ? null : body, {
    status: 200,
    headers: {
      "content-type": DIRECTORY_CONTENT_TYPE,
      "cache-control": "public, max-age=300, stale-while-revalidate=86400",
    },
  });
}

export async function handleWebBotAuthDirectory(context) {
  const { request, env } = context;
  const url = new URL(request.url);
  if (url.pathname !== DIRECTORY_PATH) return null;

  if (!["GET", "HEAD"].includes(request.method)) {
    return new Response("Method Not Allowed", {
      status: 405,
      headers: { allow: "GET, HEAD" },
    });
  }

  const privateJwk = parseJwk(env.WEB_BOT_AUTH_PRIVATE_JWK, "WEB_BOT_AUTH_PRIVATE_JWK");
  if (!privateJwk) return fallbackDirectoryResponse(request);

  try {
    const configuredPublicJwk = parseJwk(env.WEB_BOT_AUTH_PUBLIC_JWK, "WEB_BOT_AUTH_PUBLIC_JWK");
    const publicJwk = publicJwkFrom(privateJwk, configuredPublicJwk);
    const signed = await signDirectory({ request, privateJwk, publicJwk });
    return new Response(request.method === "HEAD" ? null : signed.body, {
      status: 200,
      headers: signed.headers,
    });
  } catch (error) {
    console.error("web_bot_auth_misconfigured", error?.name || "Error", error?.message || "unknown");
    return new Response(JSON.stringify({ error: "web_bot_auth_misconfigured" }), {
      status: 500,
      headers: {
        "content-type": "application/json; charset=utf-8",
        "cache-control": "no-store",
      },
    });
  }
}
