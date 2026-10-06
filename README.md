# Click With Confidence — website modernization

A visual and UX modernization of [clickwithconfidence.org](https://clickwithconfidence.org). The content, images, embeds, links, page addresses and file layout of the original site are kept. The redesign changes how the site looks and behaves.

`public_html/` mirrors the original cPanel `public_html/` folder, so it can be uploaded with the cPanel File Manager. There is no build step.

---

## Two display modes, one copy of the content

Every page is written once. A switch in the header changes how that same content is presented:

| | **Interactive** (default) | **Readable** |
|---|---|---|
| For | Partners, donors, judges, media, general visitors | Seniors, and anyone who wants calm, large text |
| Look | Glass header, particle-network backgrounds, gradient display type, depth and cards | White page, large high-contrast text, plain blocks, like the original site |
| Motion | Scroll reveals, parallax, animated counters, word-by-word reading highlight, card tilt, timeline on Founder's Story | None |
| Menu | Inline on wide screens, full-screen menu on smaller ones | Large buttons that are always visible, also on phones |
| Extras | — | Text size buttons (A / A+ / A++), thick focus outlines, underlined links |

- The visitor's choice is remembered on that device (`localStorage`).
- A link can open a page in a given mode: add `?mode=readable` or `?mode=interactive`. This is useful on printed flyers for seniors, for example `clickwithconfidence.org/?mode=readable`.
- If a visitor's device is set to reduce motion, Interactive mode shows no animation.
- Both modes are responsive from 320 px phones up to wide desktops.

## Fonts

The supplied fonts were converted to compact web fonts (WOFF2, Latin character set) in `public_html/sitepro/fonts/`:

- **Headings:** Helvetica Neue LT Pro. Condensed Black and Extra Black are used for display titles, Heavy Condensed for section headings, Thin for the large impact numbers, and Roman, Medium and Bold for the menu and buttons.
- **Subheadings:** Minion Pro Display (Regular and Italic).
- **Body:** Minion Pro.

> Helvetica Neue LT Pro and Minion Pro are commercial typefaces. Please confirm that CwC's license covers **web** embedding before going live.

## Brand

The palette is `#5CA3FF`, `#1F80FF` and `#004AAD`, with near-black `#0A1A33` and near-white `#F6F9FF`. The logo is the supplied vector version (`gallery/logo-wide.svg`, `gallery/logo-shield.svg`). It is the same artwork as the original `gallery/228645c9c76645c66dec4d938d02c4cf.jpg`, which is still in place.

---

## Deploying through cPanel File Manager

1. **Back up the live site first.** In File Manager, select everything in `public_html`, then choose **Compress** and download the zip.
2. Upload the **contents** of this repo's `public_html/` folder into the server's `public_html/`, and let it overwrite existing files.
   - Hidden files such as `.htaccess` are not changed. Turn on *Settings → Show Hidden Files* if you want to check them.
3. Open the site, then try `/impact`, `/App`, `/privacy-policy` and an address that doesn't exist, which should show the 404 page.

To roll back, restore the backup zip.

> If the site is ever published again from the **Site.pro builder**, the builder will overwrite these page files. From now on, edit content in the page files described below.

### What the upload changes

Everything else in `public_html/` is byte-for-byte identical to the original, including all of `gallery/`, `gallery_gen/`, the original CSS and JS bundles, `.htaccess` and `web.config`.

| Status | Files |
|---|---|
| **Replaced, same names** | The 12 page files `sitepro/a19….php` and the router `sitepro/index.php` |
| **New** | `sitepro/cwc.inc.php` (shared header and footer), `sitepro/css/cwc.css`, `sitepro/js/cwc.js`, `sitepro/fonts/*.woff2`, `sitepro/gallery/logo-wide.svg`, `sitepro/gallery/logo-shield.svg` |

> **Not in this repo:** Site.pro's internal files `sitepro/data.json`, `sitepro/data.json.lock` and `sitepro/dat/`. They hold the builder's license token and project database, and `.htaccess` already blocks them from the web. The new router doesn't use them. They stay on the server untouched, because uploading doesn't delete files.

### Why the router was replaced

The original `sitepro/index.php` was Site.pro's obfuscated runtime. It contacts Site.pro's licensing service and shows "Website is temporary unavailable" if that license check fails. The new router is a short, readable file at the same path. It sends the same addresses to the same page files, so no URL changes:

| Address | Page file |
|---|---|
| `/` | `a19e61b70f0e00cc22082eb6eb01d897.php` (Home) |
| `/impact` | `a199bbdbb9df01a697e78bf56eba1508.php` |
| `/what-we-do` | `a199bbdbb9df02b8bc6069b318b34b50.php` |
| `/leadership` | `a199bbdbb9df035b666498f507ad85ce.php` |
| `/Founders-Story` | `a19a0e4884d200534b5bac2b002abb46.php` |
| `/presentations` | `a199bbdbb9df043f0f5ce4eb1ecf24f2.php` (Docs & Presentations) |
| `/video-content` | `a199bbdbb9df050f379b945a793a7ba4.php` |
| `/App` | `a199dfef8736007e965d9ae3b77376cf.php` (not in the menu) |
| `/Flyer-Brochure` | `a19bc280d2df009618adcfd21949f7a3.php` (not in the menu) |
| `/privacy-policy` | `a199bbdbb9df00c39633cbfcbc916828.php` (not in the menu) |
| anything else | `a199bbdbba5a00f7e3efcee9f99665a9.php` (Custom 404 page, with a 404 status) |

The site must sit at the root of `public_html`, as it does today. The original `.htaccess` files hard-code `RewriteBase /`, so a staging copy in a subfolder needs those lines adjusted.

It also serves `/sitemap.xml` from the original `sitepro/sitemap_template`. It redirects differences in letter case, such as `/app` or `/founders-story`, to the original address. It works with both `.htaccess` (Apache) and `web.config` (IIS), and runs on PHP 5.4 through 8.x.

## Editing content

Each page's text is plain HTML inside its page file (see the table above). The menu, the announcement bar, the footer and the cookie notice are in `sitepro/cwc.inc.php`. CSS and JS links carry a file-date version, so edits show up right away even though `.htaccess` tells browsers to cache those files for a year.

## Working locally

```bash
php -S 127.0.0.1:8080 -t public_html tools/dev-router.php
```

`tools/dev-router.php` reproduces the `.htaccess` rewrite rules for PHP's built-in server. It is not uploaded.

### Content check

`tools/verify_content.py` compares every original page with the new one. It checks that each piece of original text, each image, each embed and each link is still present. Run it with the dev server up, passing the path to the original `public_html` backup:

```bash
python3 tools/verify_content.py "/path/to/oldwebsite/public_html"
```

All 10 pages currently pass.

---

## Decisions to confirm with CwC

These are the only places where the new site differs from a literal copy of the old pages. Each is easy to reverse.

1. **Menu.** It shows exactly Home, Impact, What We Do, Leadership, Founder's Story, Docs & Presentations and Video Content. *App* and *Flyer & Brochure* were removed from the menu as the brief asks. Both pages still work at `/App` and `/Flyer-Brochure`, like `/privacy-policy`. The footer repeats the same seven menu items.
2. **Duplicate home-page blocks left over from the builder.** The old home page had three extra "Who We Are" headings with no text, plus a second copy of the "Our Vision" heading and paragraph. On desktop these sat off-screen. On phones they appeared as repeated headings. Each piece of home-page text now appears once.
3. **A broken slideshow on Docs & Presentations.** One embed's code was cut off on the old page, so visitors saw a stray `src="https://docs.google.com/…"` line instead of a slideshow. When repaired, it shows an "IRS scams" deck that looks the same as the deck right after it. It is kept in the page file, commented out, and is not shown. To show it, move the line out of the comment.
4. **"Video Content & Library" button.** On the old site this button has **no link**, and that is still true. Send the URL it should open.
5. **Two Instagram accounts.** The footer icon links to `instagram.com/clickwithconfidence1`. On the old site, an outer link around the same icon pointed to `instagram.com/clickwithconfidenceorg`, but the icon's own link always took the click. Only the reachable link is kept. Confirm which account is current.
6. **Leadership.** The old slideshow, which showed one person at a time, is now a grid with all six members visible, using the same photos, names and roles. The small thumbnail copies stay in `gallery_gen/` but are no longer used.
7. **Small additions.** The announcement bar now links to Docs & Presentations, since its text points there. Pages without an on-page title got their existing page name as a heading (for example, "Leadership"). Photos got descriptive alt text for screen readers. The supplied vector logo is used for sharper rendering.
8. **Impact spreadsheet.** The embedded "CWC Organization Tracker" Google Sheet has contact name, phone and email columns. It was already public on the old site. Check that it doesn't expose personal details CwC didn't intend to publish.
9. **Cookie notice.** The text and the Reject and Got it buttons are kept as they were. The site currently loads no analytics (the Site.pro `ga_code` file is empty).
10. **Not included:** the server-managed empty folders `.well-known/` and `cgi-bin/`. Uploading does not delete them. The rest of the cPanel backup (mail, SSL keys, logs) is not part of the website and is not in this repo.
