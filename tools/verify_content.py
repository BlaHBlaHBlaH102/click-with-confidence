#!/usr/bin/env python3
"""
Verbatim-content check: every piece of text, every link, every image and every
embed on the ORIGINAL Site.pro pages must still be present on the new pages.

Usage:
  1. Start the dev server:  php -S 127.0.0.1:8080 -t public_html tools/dev-router.php
  2. Run:  python3 tools/verify_content.py <path-to-old-public_html>

Needs only the Python standard library.
"""
import html, re, sys, urllib.request
from html.parser import HTMLParser

PAGES = {
    '':               'a19e61b70f0e00cc22082eb6eb01d897.php',
    'impact':         'a199bbdbb9df01a697e78bf56eba1508.php',
    'what-we-do':     'a199bbdbb9df02b8bc6069b318b34b50.php',
    'leadership':     'a199bbdbb9df035b666498f507ad85ce.php',
    'presentations':  'a199bbdbb9df043f0f5ce4eb1ecf24f2.php',
    'video-content':  'a199bbdbb9df050f379b945a793a7ba4.php',
    'App':            'a199dfef8736007e965d9ae3b77376cf.php',
    'Founders-Story': 'a19a0e4884d200534b5bac2b002abb46.php',
    'Flyer-Brochure': 'a19bc280d2df009618adcfd21949f7a3.php',
    'privacy-policy': 'a199bbdbb9df00c39633cbfcbc916828.php',
}
# Site.pro menus that were hidden on the old pages (not shown to visitors).
HIDDEN_MENU_LABELS = {'Presentations'}
# Menu entries removed on purpose (brief: App and Flyer & Brochure stay off the menu).
REMOVED_MENU = {('App', 'App'), ('Flyer & Brochure', 'Flyer-Brochure')}
# Known, deliberate differences (each is listed in README.md):
KNOWN_LINK_EXCEPTIONS = {
    # The old footer wrapped the Instagram icon in a second link (to @clickwithconfidenceorg via a
    # Google redirect). The icon's own link (@clickwithconfidence1) always took the click, so the
    # outer one was unreachable; only one link can wrap the icon, and the reachable one is kept.
    'https://www.google.com/url?q=https%3A%2F%2Fwww.instagram.com%2Fclickwithconfidenceorg%3Futm_source%3Dig_web_button_share_sheet%26igsh%3DZDNlZDc0MzIxNw%3D%3D&sa=D&sntz=1&usg=AOvVaw12iZwo0VRpxk2I3IbWVw59',
}
# This embed's markup was cut off on the old page (visitors saw stray text, not a slideshow).
# Its code is kept, commented out, in the Docs & Presentations page file.
KNOWN_EMBED_EXCEPTIONS = {
    'https://docs.google.com/presentation/d/e/2PACX-1vRC9U_YIN2x9XXwiVir9Vu911zokkne9RhmuOG5geOVLdztkQodHu4mVSQPTCLrIztTThF1-G5LleRG/pubembed?start=false&loop=false&delayms=3000',
}
# The old Leadership slideshow had a strip of small thumbnail copies; the new page shows the
# full-size photos instead. The thumbnail files stay in gallery_gen/ unchanged.
KNOWN_IMAGE_EXCEPTIONS = {
    'gallery_gen/3c45de864d827ce35b5195761d668fa2_200x200_fill.jpg',
    'gallery_gen/bfc613b598522ac0a7ae0240b5da86f0_200x200_fill.jpg',
    'gallery_gen/b9dff477f595e5f2758dd20245b650dd_200x200_fill.jpg',
    'gallery_gen/8c15096e57a7a8fc5bc6c44297b68858_178x225.98260869565_fill.jpg',
    'gallery_gen/93c81959133fc808125ad9ebfdea85bd_158x254.37213930348_fill.jpg',
    'gallery_gen/cf6812476ab8eabbf6266c2e9b854133_174x231.95158597663_fill.jpg',
}


def norm(s):
    s = html.unescape(s).replace('\xa0', ' ')
    s = re.sub('[\ue000-\uf8ff]', '', s)  # icon-font glyphs (FontAwesome), not text
    return re.sub(r'\s+', ' ', s).strip()


class Collector(HTMLParser):
    """Collects text blocks, link targets, image sources and iframe sources."""
    BLOCK = {'p', 'h1', 'h2', 'h3', 'h4', 'li', 'span', 'a', 'figcaption', 'button', 'div', 'em', 'strong'}

    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.skip = 0
        self.text = []
        self.links, self.imgs, self.frames = set(), set(), set()

    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        if tag in ('script', 'style', 'noscript'):
            self.skip += 1
        if tag == 'a' and a.get('href'):
            self.links.add(a['href'])
        if tag == 'img' and a.get('src'):
            self.imgs.add(a['src'].split('?')[0])
        if tag == 'iframe' and a.get('src'):
            self.frames.add(a['src'])
        self.text.append(' ')

    def handle_endtag(self, tag):
        if tag in ('script', 'style', 'noscript'):
            self.skip -= 1
        self.text.append(' ')

    def handle_data(self, data):
        if not self.skip:
            self.text.append(data)


def old_strings(src):
    """Text strings from the old page's content elements (TextArea, Button, gallery captions...)."""
    src = re.sub(r'<\?php.*?\?>', '', src, flags=re.S)
    body = src[src.find('<body'):]
    body = re.sub(r'<script.*?</script>', '', body, flags=re.S)
    strings = []
    for m in re.finditer(r'<(p|h1|h2|h3|span)\b[^>]*>(.*?)</\1>', body, flags=re.S):
        inner = re.sub(r'<[^>]+>', '', m.group(2))
        t = norm(inner)
        if t and t not in HIDDEN_MENU_LABELS:
            strings.append(t)
    # gallery captions live in JSON inside scripts
    for m in re.finditer(r'"title":"([^"]*)"[^}]*?"description":"([^"]*)"', src):
        for t in m.groups():
            t = norm(t.encode().decode('unicode_escape'))
            if t:
                strings.append(t)
    return strings


def old_assets(src):
    src = re.sub(r'<\?php.*?\?>', '', src, flags=re.S)
    body = src[src.find('<body'):]
    body = re.sub(r'<script.*?</script>', '', body, flags=re.S)
    c = Collector()
    c.feed(body)
    imgs = set(c.imgs)
    for m in re.finditer(r'"(thumb|src)":"(gallery[^"]+)"', src):
        imgs.add(m.group(2).replace('\\/', '/').split('?')[0])
    # embeds inside custom HTML (incl. one whose markup was cut off on the old page)
    frames = set(re.findall(r'src="((?:https?:)?//(?:docs\.google|www\.canva)[^"]+)"', html.unescape(body)))
    links = {l for l in c.links if not l.startswith('{{')}
    return imgs, frames, links


def main():
    if len(sys.argv) < 2:
        sys.exit(__doc__)
    old_root = sys.argv[1].rstrip('/') + '/sitepro/'
    failures = 0
    for route, fname in PAGES.items():
        src = open(old_root + fname, encoding='utf-8').read()
        new_html = urllib.request.urlopen('http://127.0.0.1:8080/' + route).read().decode('utf-8')
        c = Collector()
        c.feed(new_html)
        new_text = norm(''.join(c.text))
        new_frames = {html.unescape(f) for f in c.frames}
        new_imgs = c.imgs | {m.split('?')[0] for m in re.findall(r'href="(gallery[^"]+)"', new_html)}

        missing_text = sorted({s for s in old_strings(src) if s not in new_text})
        imgs, frames, links = old_assets(src)
        missing_imgs = sorted(i for i in imgs if i not in new_imgs and i not in KNOWN_IMAGE_EXCEPTIONS
                              and i != 'gallery/228645c9c76645c66dec4d938d02c4cf.jpg')  # logo: same artwork, now the supplied SVG
        missing_frames = sorted(f for f in frames if f not in new_frames and f not in KNOWN_EMBED_EXCEPTIONS)
        new_links = c.links
        removed = {r[1] for r in REMOVED_MENU}
        missing_links = sorted(l for l in links if l not in new_links and l not in removed and l not in KNOWN_LINK_EXCEPTIONS)

        status = 'OK ' if not (missing_text or missing_imgs or missing_frames or missing_links) else 'FAIL'
        print(f'{status} /{route}')
        for label, items in (('text', missing_text), ('image', missing_imgs), ('embed', missing_frames), ('link', missing_links)):
            for item in items:
                failures += 1
                print(f'      missing {label}: {item[:140]}')
    print('\nAll original text, images, embeds and links are present.' if not failures else f'\n{failures} problem(s) found.')
    sys.exit(1 if failures else 0)


if __name__ == '__main__':
    main()
