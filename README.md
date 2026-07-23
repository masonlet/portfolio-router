# Portfolio Router

A [Cloudflare Worker](https://developers.cloudflare.com/workers/) that fronts my portfolio domains, handling canonical redirects and routing paths to the backends that serve them. It runs on every request to `masonletoile.ca` / `.com` (bare and `www`) and does three things, in order:

![License](https://img.shields.io/badge/License-MIT-green)

1. **Canonicalizes the host**: any `.com` or `www.*.com` request is 308-redirected to the matching `masonletoile.ca` URL, preserving path and query.
2. **Rewrites known paths** to their backend:
   - project endpoints (e.g. `/api/languages`) are proxied to standalone Vercel functions
   - project prefixes (e.g. `/pixel-parker`) are proxied to that project's deployment
3. **Falls through**: everything else is served from the main portfolio Pages project.

## Routing table

| Incoming path                 | Backend                              | Type         |
| ---                           | ---                                  | ---          |
| `/api/languages`              | `github-top-languages.vercel.app`    | exact proxy  |
| `/api/contact`                | `contact-api-resend.vercel.app`      | exact proxy  |
| `/api/readme`                 | `readme-api-nine.vercel.app`         | exact proxy  |
| `/contact-api-demo/*`         | `contact-api-demo.pages.dev`         | prefix proxy |
| `/readme-api-demo/*`          | `readme-api-demo.pages.dev`          | prefix proxy |
| `/pixel-parker/*`             | `pixel-parker.pages.dev`             | prefix proxy |
| `/starweb-sandbox/*`          | `starweb-sandbox.pages.dev`          | prefix proxy |
| `/gh-top-languages-builder/*` | `gh-top-languages-builder.pages.dev` | prefix proxy |
| everything else               | `portfolio-8dg.pages.dev`            | fallthrough  |

A bare prefix (`/pixel-parker`) 308-redirects to its trailing-slash form (`/pixel-parker/`); the remaining path is forwarded to the backend as-is. Prefixes match only on a path-segment boundary, so `/pixel-parker-notes` is **not** treated as `/pixel-parker`; it falls through.

### Backend requirement

Prefix-proxied projects are mounted at a subpath, so they **must build with a matching base path** (e.g. Vite `base: '/pixel-parker/'`). A project that emits root-absolute asset URLs like `/assets/app.js` will have those requests miss the prefix rule and fall through to the main portfolio site.

## Development

```bash
npm install
npm run dev      # local server via wrangler
npm test         # vitest
npm run deploy   # publish to Cloudflare
```

Routing logic lives entirely in [`src/index.ts`](src/index.ts). Cloudflare trigger routes are configured in `wrangler.jsonc`; the routing logic and destination hosts live in the rewrites array in `src/index.ts`. To reuse this for your own domains, adjust both.

`worker-configuration.d.ts` is generated (`npm run cf-typegen`) and committed so the project typechecks on a fresh clone without a Cloudflare login.

## License

MIT License - see [LICENSE](./LICENSE) for details.
