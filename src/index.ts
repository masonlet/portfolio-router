interface RewriteRule {
  source?: string;
  prefix?: string;
  destination: string;
}

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);

    if (url.hostname === 'masonletoile.com' || url.hostname === 'www.masonletoile.com') {
      url.hostname = 'masonletoile.ca';
      return Response.redirect(url.toString(), 301);
    }

    const pathname = url.pathname;

    const rewrites: RewriteRule[] = [
      { source: '/api/languages', destination: 'https://github-top-languages.vercel.app/api/languages' },
      { source: '/api/contact', destination: 'https://contact-api-resend.vercel.app/api/contact' },
      { source: '/api/readme', destination: 'https://readme-api-nine.vercel.app/api/readme' },
      { prefix: '/contact-api-demo', destination: 'https://contact-api-demo.pages.dev' },
      { prefix: '/readme-api-demo', destination: 'https://readme-api-demo.pages.dev' },
      { prefix: '/pixel-parker', destination: 'https://pixel-parker.pages.dev' },
      { prefix: '/starweb-sandbox', destination: 'https://starweb-sandbox.pages.dev' },
      { prefix: '/gh-top-languages-builder', destination: 'https://gh-top-languages-builder.pages.dev' }
    ];

    for (const rule of rewrites)
      if (rule.source && pathname === rule.source)
				return fetch(`${rule.destination}${url.search}`, request);

    for (const rule of rewrites) {
      if (rule.prefix && pathname.startsWith(rule.prefix)) {
        if (pathname === rule.prefix) {
          url.pathname = rule.prefix + '/';
          return Response.redirect(url.toString(), 301);
        }

        let remainingPath = pathname.substring(rule.prefix.length);
        if (!remainingPath.startsWith('/')) remainingPath = '/' + remainingPath;

        const targetUrl = `${rule.destination}${remainingPath}${url.search}`;
        return fetch(new Request(targetUrl, request));
      }
    }

    return fetch(request);
  }
} satisfies ExportedHandler<Env>;
