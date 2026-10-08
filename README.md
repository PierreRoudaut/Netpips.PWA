# Netpips.PWA
[![Build Status](https://travis-ci.org/PierreRoudaut/Netpips.PWA.svg?branch=master)](https://travis-ci.org/PierreRoudaut/Netpips.PWA)

Angular based Progressive Web App client consuming the [Netpips.Server](https://github.com/PierreRoudaut/Netpips.Server) API.

## Features

- Sign in with Google (the server exchanges the Google ID token for its own JWT)
- Start, follow, cancel and archive downloads (magnet, torrent and direct links) and search torrents
- Browse the media library as a tree, treemap and distribution chart, rename and delete items, fetch subtitles
- Follow TV shows and get new episodes downloaded automatically
- User administration for admins

## Requirements

- Node.js 20.19+, 22.12+ or 24+ (22 LTS recommended)
- npm 10+
- A running Netpips.Server and a Google OAuth **Web client ID** that allows your site's origin

## Getting started

```sh
npm ci
npm start          # http://localhost:4200
```

### Configuration

`src/environments/environment.ts` holds the development settings:

| Key | Description |
| --- | --- |
| `apiEndpoint` | Base URL of Netpips.Server (the app calls `<apiEndpoint>/api/...`) |
| `auth.clientId` | Google OAuth Web client ID |
| `chromeExtensionUrl` | Link shown in the side menu |
| `production`, `logging`, `routerTracingEnabled` | Runtime flags |

`environment.dev.ts`, `environment.staging.ts` and `environment.prod.ts` are gitignored. Copy
`environment.ts` to create the ones you need.

## Scripts

| Command | What it does |
| --- | --- |
| `npm start` | Dev server |
| `npm run serve.dev` / `serve.staging` / `serve.prod` | Dev server with the matching environment |
| `npm run build` | Development build into `dist/Netpips.PWA` |
| `npm run build.staging` / `build.prod` | Optimised build into `dist/staging` / `dist/prod` |
| `npm test` | Unit tests in watch mode |
| `npm run test.ci` | Single run of the unit tests with coverage (`coverage/`) |

## Tests

Unit tests use Karma and Jasmine in Chrome (set `CHROME_BIN` if Chrome is not on the default path). They
cover the models, helpers, HTTP services, auth service, API interceptor, Google sign-in component and login page.
Most feature components (downloads, media, tv-shows, users, home) are not yet covered.

## Tech

Angular 21 LTS, Angular Material 21, DevExtreme 26, RxJS 7, TypeScript 5.9, built with the Angular application
builder. See [CLAUDE.md](CLAUDE.md) for the code layout and conventions.
