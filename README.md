# The Spirits Industry: landing page

Static site (HTML, CSS, JavaScript). No build step, no framework.

## Put it online

1. Create a new GitHub repository (e.g. `spirits-industry`) and upload everything in this folder, keeping the structure.
2. On vercel.com: **Add New → Project → Import** the repository.
3. Framework preset: **Other**. Leave build command and output directory empty. Click **Deploy**.
4. Vercel gives you a URL like `spirits-industry.vercel.app`. That is the link for the QR code on the slide.

To check it on your computer first, open a terminal in this folder and run `python3 -m http.server`, then go to http://localhost:8000.

## Folder structure

```
index.html            all the text of the page
css/style.css         layout, fonts, colours
js/data.js            every number used by the charts (edit here)
js/sources.js         the reference list (edit here; numbering is automatic)
js/charts.js          chart definitions
js/vendor/            Chart.js 4.4.1 (local copy, no external CDN)
fonts/                EB Garamond (self-hosted)
img/                  hero photo, map, logos, bottles, Moutai bottle
img/photos/           optional photos (see below)
data/statista.json    raw extract from the Statista export used for the charts
```

## Photos to add (optional)

The page hides a photo slot automatically if the file is missing. Use photos you are allowed to publish (your own, Unsplash or Pexels), landscape, about 1600 px wide, saved as JPG with exactly these names:

| File | Subject | Section |
|---|---|---|
| `img/photos/agave.jpg` | Blue agave field or a jimador at work | Innovation & technology, raw materials |
| `img/photos/barrels.jpg` | Barrels stacked in a warehouse / rickhouse | Innovation & technology, inventory |
| `img/photos/stills.jpg` | Copper pot stills | Innovation & technology, distilling |
| `img/photos/spritz.jpg` | Spritz on a table, aperitivo setting | Opportunities |
| `img/photos/banquet.jpg` | Chinese banquet table with small baijiu glasses | Baijiu deep dive |

Also check the licence of `img/hero.jpg` (the bottles photo from the slide background) and `img/moutai.png` before publishing.

## Editing

- **Text**: `index.html`. Each section starts with a comment like `<!-- ===== 05 -->`.
- **A number in a chart**: `js/data.js`.
- **A source**: `js/sources.js`. In the text, a reference is written as `<sup class="ref" data-r="statista iwsr"></sup>`; the keys must match the first field of an entry in `sources.js`. Numbers and links are generated when the page loads.
