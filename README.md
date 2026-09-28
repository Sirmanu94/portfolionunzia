# Nunzia Monaco — Portfolio

Portfolio editoriale in React, Vite e TypeScript, con React Router DOM e Framer Motion. Nessun backend, database o CMS.

## Avvio

```sh
npm install
npm run dev
```

Build: `npm run build`. Anteprima della build: `npm run preview`.

## File principali

- `src/main.tsx`: componenti, homepage, quattro pagine progetto, navigazione e lightbox video.
- `src/data.ts`: progetti, contributi, link social, fasi e competenze.
- `src/style.css`, `src/redesign.css`, `src/refinement.css` e `src/final.css`: base editoriale e rifiniture responsive.
- `public/assets`: copie ottimizzate WebP e MP4 H.264 con audio AAC.
- `src/media-manifest.json`: corrispondenza fra nomi originali e identificativi video.
- `scripts/prepare-assets.mjs`: genera immagini WebP e poster dai materiali originali.
- `scripts/prepare-feed-assets.mjs`: genera le copie WebP dei sei screenshot dei feed.
- `scripts/encode-videos.mjs`: converte gli otto video selezionati, saltando gli output già esistenti.
- `scripts/verify.mjs`: verifica browser con Edge/Playwright; output in `verification`.

## Design e media

Palette avorio, antracite e azzurro polvere; DM Sans e Cormorant Garamond distribuiti localmente. Ritratto ad arco, sezione Education, progetti con fondi alternati, gallerie verticali e animazioni leggere. Su mobile i contenuti dei progetti scorrono in sequenza verticale, con feed e Reel a tutta larghezza.

I video vengono scaricati e riprodotti solo dopo un clic, in una lightbox chiudibile con Escape. Il focus torna al pulsante di apertura e lo scorrimento del body è sospeso mentre la lightbox è aperta. Le grafiche si aprono a dimensione completa. Nessuna metrica di risultato o competenza è stata aggiunta oltre al brief.

Le preview desktop cambiano al passaggio del mouse; su mobile ogni progetto ha una thumbnail ampia e un collegamento visibile senza hover. Il parallax è dimezzato sui tablet e disabilitato sui telefoni. Il menu mobile si chiude con link, clic esterno o Escape e blocca lo scorrimento mentre è aperto. Il video nella lightbox resta in pausa finché l'utente non avvia esplicitamente la riproduzione.

### Materiali effettivamente utilizzati

| Progetto | File originali |
| --- | --- |
| Hero | nunzia.jpeg |
| La Riviera di Parthenope | ragudiagnello.mp4, carciofo.mp4, risotto gamberi.mp4, riviera.png |
| Carbone Meat House | video 5 prep filetto pt 1.mov, video 6 prep filetto pt2.mov, 32.png, macellaio.png |
| IperBoat | grazie(1) finale.mov (identificato dal marchio visibile), 94.png, iperboat.png |
| Arma Contact | VIDEO 8 arma contact.mov, video 4 arma contact.mov, armas.png |
| Gorillas Burger | gorilla.png |
| Serra Carni | carne.png |
| Letizia Garden | 11.png |
| Postural Bed | 102.png |

I link Instagram forniti sono presenti per La Riviera di Parthenope, Carbone Meat House, IperBoat, Arma Contact, Gorillas Burger e Serra Carni. `Materiali` conserva gli originali, senza rinomine o modifiche.

## Pubblicazione

Distribuire `dist` alla radice del dominio su un hosting statico. Le route `/projects/...` richiedono fallback a `index.html`: `public/_redirects` lo configura per Netlify/Cloudflare Pages e `vercel.json` aggiunge il rewrite per Vercel. Su altri hosting configurare la regola SPA equivalente. Vite Preview fornisce già il fallback locale. Il sito non è ancora pubblicato online. Contatti email e LinkedIn sono già attivi. I video sono caricati su richiesta.

## Verifica

Eseguire `npm run build`, poi `npm run preview -- --port 4173`. Con l'anteprima attiva, `PORTFOLIO_BASE_URL=http://127.0.0.1:4173/ node scripts/verify.mjs` verifica 11 viewport da 320 a 1920 px, menu mobile, navigazione, rotta Arma aperta direttamente e ricaricata, collegamenti esterni, video, focus, lightbox e `prefers-reduced-motion`. Su PowerShell impostare la variabile con `$env:PORTFOLIO_BASE_URL='http://127.0.0.1:4173/'` prima di eseguire lo script. Screenshot e report sono salvati in `verification`.
