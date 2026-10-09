# CLAUDE.md

Guidance for working in this repository.

## Project

Netpips.PWA is an Angular progressive web app (client for the
[Netpips.Server](https://github.com/PierreRoudaut/Netpips.Server) API). It lets users sign in with
Google, manage downloads, browse and organise the media library, follow TV shows and (for admins)
manage users.

## Stack

- Angular 21 (LTS), NgModule-based (not standalone), zone.js change detection
- Angular Material 21 (Material 3 theme via CSS `--mat-sys-*` tokens) and `ngx-flexible-layout` (`fx*` directives)
- DevExtreme / devextreme-angular 26 for grid, tree view, charts, gauges
- Google Identity Services for sign-in (own `GoogleSignInComponent`; the backend exchanges the Google ID token for its own JWT)
- Build: `@angular/build:application` (esbuild). Tests: Karma + Jasmine (headless Chrome)

## Commands

```sh
npm ci                    # install
npm start                 # dev server on http://localhost:4200
npm run build             # development build
npm run build.prod        # production build (needs src/environments/environment.prod.ts)
npm test                  # Karma in watch mode
npm run test.ci           # single run with coverage (coverage/)
```

Headless Chrome needs `CHROME_BIN` set if Chrome is not on the default path. `karma.conf.js` already
launches Chrome with `--no-sandbox`.

## Layout

```
src/app/
  app.module.ts, app-routing.module.ts   root module and routes (routes are guarded by AuthGuard + role data)
  api.service.ts                         base class for HTTP services (API_BASE_URL = environment.apiEndpoint + '/api')
  api-interceptor.service.ts             adds the bearer token, redirects to /login on 401
  auth/                                  AuthService (JWT in localStorage), AuthGuard, User model
  login/                                 login page + GoogleSignInComponent
  downloads/ media/ tv-shows/ users/     feature modules (components, services, models)
  material.module.ts, devextreme.module.ts   shared UI module re-exports
  helpers/                               snackbar/notification services, url helper
src/styles/                              global SCSS and the Material theme
src/environments/                        environment.ts is tracked; environment.{dev,staging,prod}.ts are gitignored
```

## Conventions

- Imports resolve from `src` (`baseUrl`), e.g. `import { environment } from 'environments/environment'`.
- Components, directives and pipes are declared in NgModules, so each decorator sets `standalone: false`.
- Existing source files use CRLF line endings; keep the file's existing endings when editing so diffs stay small.
- Services extend `APIService`, return RxJS observables and map DTOs into model classes.
- Theme colours: Angular Material 3 only knows `primary`, `secondary`, `tertiary` and `error` for the `color` input
  (the old `accent`/`warn` were replaced by `tertiary`/`error`). Use `var(--mat-sys-*)` tokens in SCSS.
- Do not add `window`/`gapi`-style globals; the Google script is loaded from `index.html` and typed via `@types/google.accounts`.

## Testing

- Specs live next to the code as `*.spec.ts`. HTTP services are tested with `provideHttpClient()` + `provideHttpClientTesting()`.
- Add or update a spec when changing a service, model or helper. Pure logic (models, `MediaLibrary`, helpers) is the easiest to cover.
- Several feature components (downloads, media, tv-shows, users, home) still have no specs.

## Keeping Angular current

Stay on the latest Angular LTS line (`npm view @angular/core dist-tags` -> `vNN-lts`). Angular, CDK, Material,
CLI, `@angular/build` and `ngx-flexible-layout` must share the same major. `devextreme` and `devextreme-angular`
must be the exact same version. Run `npm run build` and `npm run test.ci` after any dependency change.
