interface RewriteRule {
  source?:     string;
  prefix?:     string;
  destination: string;
}
const rewrites: RewriteRule[] = [
  { source: '/api/languages',    destination: 'https://github-top-languages.vercel.app/api/languages' },
  { source: '/api/contact',      destination: 'https://contact-api-resend.vercel.app/api/contact' 		},
  { source: '/api/readme',       destination: 'https://readme-api-nine.vercel.app/api/readme' 				},
  { prefix: '/contact-api-demo', destination: 'https://contact-api-demo.pages.dev' 									  },
  { prefix: '/readme-api-demo',  destination: 'https://readme-api-demo.pages.dev' 										},
  { prefix: '/pixel-parker',     destination: 'https://pixel-parker.pages.dev' 												},
  { prefix: '/starweb-sandbox',  destination: 'https://starweb-sandbox.pages.dev' 										},
  { prefix: '/gh-top-languages-builder', destination: 'https://gh-top-languages-builder.pages.dev'    }
];
const PORTFOLIO = 'https://portfolio-8dg.pages.dev';

export default {
  async fetch(request: Request): Promise<Response> {
    const url = new URL(request.url);

    if (url.hostname === 'masonletoile.com'
     || url.hostname === 'www.masonletoile.com'
     || url.hostname === 'www.masonletoile.ca'
    ) {
      url.hostname = 'masonletoile.ca';
      return Response.redirect(url.toString(), 308);
    }

    const pathname = url.pathname;

    for (const rule of rewrites) if (rule.source && pathname === rule.source) return fetch(
			`${rule.destination}${url.search}`, request
		);

    for (const rule of rewrites) {
      if (rule.prefix && (pathname === rule.prefix || pathname.startsWith(rule.prefix + '/'))) {
        if (pathname === rule.prefix) {
          url.pathname = rule.prefix + '/';
          return Response.redirect(url.toString(), 308);
        }

        return fetch(
          `${rule.destination}${pathname.substring(rule.prefix.length)}${url.search}`,
          request
        );
      }
    }

    return fetch(`${PORTFOLIO}${url.pathname}${url.search}`, request);
  }
} satisfies ExportedHandler<Env>;
