// Cloudflare Pages Functions invocation routes, written into each build output
// as _routes.json. Without it Pages runs functions/ (middleware + catch-all)
// on every request, including every image and font under /assets/.
// /assets/* never needs a Function: the markdown middleware already skips it.
export const PAGES_ROUTES = {
  version: 1,
  include: ["/*"],
  exclude: ["/assets/*"],
};

export const PAGES_ROUTES_JSON = `${JSON.stringify(PAGES_ROUTES, null, 2)}\n`;
