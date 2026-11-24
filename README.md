# point-pointer

Offline static clone of [pointerpointer.com](https://pointerpointer.com/) — a cursor always points back at your pointer.

Fully static: no backend, no iframe, no external requests. Images were pre-downloaded into `./images/`.

## Live site

https://rishad-aj.github.io/point-pointer/

## How it works

The page ships with all 711 fingertip positions inlined (mirrored in `positions.json` for reference), then shows the image whose hotspot is nearest to your pointer. Everything loads locally — no backend, no iframe, no external requests.

## Refresh the photos

`images/` already contains all 711 photos (0.jpg–710.jpg). To re-download or fill in missing files:

```sh
node download-images.mjs
```

## Preview locally

```sh
npx serve .
# or: python3 -m http.server 8000
```

## Deploy — GitHub Pages

This repo is served directly from the `main` branch root via GitHub Pages (`.nojekyll` enabled).

## Deploy — Vercel / Firebase

```sh
vercel deploy          # framework preset: Other, no build command, output: ./
# or
firebase init hosting  # public dir: this folder
firebase deploy
```
