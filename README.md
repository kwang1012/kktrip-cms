# KK Trip CMS

KK Trip’s content site embeds EmDash in an Astro 6 application deployed to
Cloudflare Workers, with D1 for content and R2 for media. EmDash is consumed as
a package dependency; changes to its engine do not require maintaining a fork.

The active application is [`packages/blog`](packages/blog/README.md).
Public article URLs and the existing KK Trip design are preserved. The admin
is served at `/_emdash/admin/` in the same application.

## Development and validation

Use Node 22.16 or later and the pinned pnpm 12.9.1:

```sh
pnpm install --frozen-lockfile
pnpm dev
pnpm lint
pnpm test
pnpm seed:validate
pnpm check
pnpm build
```

The checked-in configuration targets an isolated preview Worker and fresh
resources. Follow the [migration and cutover guide](packages/blog/README.md)
before deploying or assigning production domains. GitHub Actions validates the
application; it does not deploy automatically.

The legacy FlareCMS engine, backend, Astro integration and documentation site
remain in `packages/core`, `packages/cms`, `packages/astro` and `packages/site`
for rollback during migration. Their history is preserved from
[jjaimealeman/flarecms](https://github.com/jjaimealeman/flarecms).
