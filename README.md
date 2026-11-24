# Srinivas Teja weds Srilekha — wedding invite website

బెల్లంకొండ వారి పెళ్లి సందడి · 10 December 2026 · Ukku Kala Vedika, Jaggaiahpeta

## Flow
1. Temple doors open onto the mandir; walk through the doorway
2. Scroll: the couple walk up the path to the mandir while the names appear in the sky
3. Names, shubhalekha, muhurtham countdown, events timeline, rituals, brother's note, hosts

## Edit content
All text, times and venues are in `src/data.js` and `index.html`.
Images live in `public/img/`. Background music: add `public/audio/music.mp3`.

## Run
```bash
npm install
npm run dev      # local preview
npm run build    # production build in dist/
```
Pushing to `main` deploys to GitHub Pages (Settings → Pages → Source: GitHub Actions).

Built with Vite + GSAP (ScrollTrigger).
