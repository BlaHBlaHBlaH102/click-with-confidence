<?php
/**
 * Click With Confidence — shared page layout.
 *
 * Every page file in this folder calls cwc_page_start() and cwc_page_end() so
 * the header, menu, footer and cookie notice live in one place. Page content
 * stays in the page files themselves and is written once: the "Interactive"
 * and "Readable" display modes are two presentations of the same markup,
 * switched with the data-mode attribute on <html> (see css/cwc.css, js/cwc.js).
 */

if (defined('CWC_LAYOUT_LOADED')) {
	return;
}
define('CWC_LAYOUT_LOADED', true);

/** Main menu: labels and addresses exactly as on the original site. */
function cwc_menu() {
	return array(
		array('key' => 'home',          'href' => '{{base_url}}',   'label' => 'Home'),
		array('key' => 'impact',        'href' => 'impact',         'label' => 'Impact'),
		array('key' => 'what-we-do',    'href' => 'what-we-do',     'label' => 'What We Do'),
		array('key' => 'leadership',    'href' => 'leadership',     'label' => 'Leadership'),
		array('key' => 'founders',      'href' => 'Founders-Story', 'label' => 'Founder\'s Story'),
		array('key' => 'presentations', 'href' => 'presentations',  'label' => 'Docs & Presentations'),
		array('key' => 'video-content', 'href' => 'video-content',  'label' => 'Video Content'),
	);
}

function cwc_e($text) {
	return htmlspecialchars($text, ENT_QUOTES, 'UTF-8');
}

/** Asset URL with a file-time version, because .htaccess caches css/js for a year. */
function cwc_asset($path) {
	$file = dirname(__FILE__) . '/' . $path;
	return $path . (is_file($file) ? '?v=' . filemtime($file) : '');
}

/** Small inline icons (decorative). */
function cwc_icon($name) {
	$icons = array(
		'arrow'    => '<path d="M5 12h14M13 6l6 6-6 6"/>',
		'card'     => '<rect x="2.5" y="5" width="19" height="14" rx="2.5"/><path d="M2.5 10h19M6.5 15h4"/>',
		'download' => '<path d="M12 4v11M7 10.5l5 5 5-5M4.5 19.5h15"/>',
		'play'     => '<path d="M8 5.5v13l11-6.5z"/>',
	);
	if (!isset($icons[$name])) {
		return '';
	}
	return '<svg class="icon icon--' . $name . '" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">' . $icons[$name] . '</svg>';
}

/** Text-size buttons (shown in Readable mode). */
function cwc_text_size_control() {
	return '<div class="text-size" role="group" aria-label="Text size">'
		. '<span class="text-size__label" aria-hidden="true">Text size</span>'
		. '<button type="button" class="text-size__btn" data-text-set="1" aria-pressed="true">A<span class="sr-only"> normal text size</span></button>'
		. '<button type="button" class="text-size__btn" data-text-set="2" aria-pressed="false">A+<span class="sr-only"> larger text size</span></button>'
		. '<button type="button" class="text-size__btn" data-text-set="3" aria-pressed="false">A++<span class="sr-only"> largest text size</span></button>'
		. '</div>';
}

function cwc_menu_links($active, $class) {
	$out = '';
	foreach (cwc_menu() as $item) {
		$current = ($item['key'] === $active) ? ' aria-current="page"' : '';
		$out .= '<li><a class="' . $class . '" href="' . $item['href'] . '"' . $current . '>' . cwc_e($item['label']) . '</a></li>';
	}
	return $out;
}

/**
 * Opens the document: <head>, announcement bar, header and <main>.
 *
 * $page keys: title, description, route, active (menu key or ''), bodyClass.
 * A title/description set by the hosting router ($seoTitle, $seoDescription)
 * still wins, as it did on the original site.
 */
function cwc_page_start($page) {
	$g = $GLOBALS;
	$title = (isset($g['seoTitle']) && $g['seoTitle'] !== '') ? $g['seoTitle'] : $page['title'];
	$description = (isset($g['seoDescription']) && $g['seoDescription'] !== '') ? $g['seoDescription'] : $page['description'];
	$keywords = (isset($g['seoKeywords']) && $g['seoKeywords'] !== '') ? $g['seoKeywords'] : 'Click With Confidence';
	$route = isset($page['route']) ? $page['route'] : '';
	$active = isset($page['active']) ? $page['active'] : '';
	$bodyClass = isset($page['bodyClass']) ? $page['bodyClass'] : '';
?><!DOCTYPE html>
<html lang="en" data-mode="industry" data-text="1">
<head>
	<meta charset="utf-8" />
	<meta name="viewport" content="width=device-width, initial-scale=1" />
	<title><?php echo cwc_e($title); ?></title>
	<base href="{{base_url}}" />
	<link rel="canonical" href="{{base_url}}<?php echo cwc_e($route); ?>" />
	<meta name="description" content="<?php echo cwc_e($description); ?>" />
	<meta name="keywords" content="<?php echo cwc_e($keywords); ?>" />
	<meta name="theme-color" content="#004AAD" />

	<!-- Facebook Open Graph -->
	<meta property="og:title" content="<?php echo cwc_e($title); ?>" />
	<meta property="og:description" content="<?php echo cwc_e($description); ?>" />
	<meta property="og:image" content="{{base_url}}gallery/228645c9c76645c66dec4d938d02c4cf.jpg" />
	<meta property="og:type" content="article" />
	<meta property="og:url" content="{{curr_url}}" />

	<script>
	/* Apply the visitor's display mode and text size before the page paints. */
	(function (d) {
		var mode = 'industry', size = '1', html = d.documentElement;
		try {
			var q = (location.search.match(/[?&]mode=([a-z]+)/) || [])[1];
			if (q === 'readable' || q === 'interactive' || q === 'industry') {
				mode = q === 'readable' ? 'readable' : 'industry';
				localStorage.setItem('cwc-mode', mode);
			} else if (localStorage.getItem('cwc-mode')) {
				mode = localStorage.getItem('cwc-mode');
			}
			size = localStorage.getItem('cwc-text') || size;
		} catch (e) {}
		html.setAttribute('data-mode', mode === 'readable' ? 'readable' : 'industry');
		html.setAttribute('data-text', /^[123]$/.test(size) ? size : '1');
		html.className += ' js';
		/* If the site script never loads, show everything rather than wait for animations. */
		setTimeout(function () { if (!window.__cwcReady) { html.className = html.className.replace(/\bjs\b/, ''); } }, 4000);
	})(document);
	</script>

	<link rel="preload" href="fonts/HelveticaNeueLTPro-HvCn.woff2" as="font" type="font/woff2" crossorigin />
	<link rel="preload" href="fonts/MinionPro-Regular.woff2" as="font" type="font/woff2" crossorigin />
	<link rel="stylesheet" href="<?php echo cwc_asset('css/cwc.css'); ?>" />

	<link rel="apple-touch-icon" type="image/png" sizes="120x120" href="gallery/favicons/favicon-120x120.png"><link rel="icon" type="image/png" sizes="120x120" href="gallery/favicons/favicon-120x120.png"><link rel="apple-touch-icon" type="image/png" sizes="152x152" href="gallery/favicons/favicon-152x152.png"><link rel="icon" type="image/png" sizes="152x152" href="gallery/favicons/favicon-152x152.png"><link rel="apple-touch-icon" type="image/png" sizes="180x180" href="gallery/favicons/favicon-180x180.png"><link rel="icon" type="image/png" sizes="180x180" href="gallery/favicons/favicon-180x180.png"><link rel="apple-touch-icon" type="image/png" sizes="192x192" href="gallery/favicons/favicon-192x192.png"><link rel="icon" type="image/png" sizes="192x192" href="gallery/favicons/favicon-192x192.png"><link rel="apple-touch-icon" type="image/png" sizes="60x60" href="gallery/favicons/favicon-60x60.png"><link rel="icon" type="image/png" sizes="60x60" href="gallery/favicons/favicon-60x60.png"><link rel="apple-touch-icon" type="image/png" sizes="76x76" href="gallery/favicons/favicon-76x76.png"><link rel="icon" type="image/png" sizes="76x76" href="gallery/favicons/favicon-76x76.png"><link rel="icon" type="image/png" href="gallery/favicons/favicon.png">
</head>
<body class="<?php echo cwc_e($bodyClass); ?>">
<a class="skip-link" href="#main">Skip to main content</a>

<div class="topbar">
	<div class="container topbar__inner">
		<a class="topbar__notice" href="presentations">
			<span>Check out the Docs &amp; Presentations Page to see CwCs Fraud Insights Report!</span>
			<?php echo cwc_icon('arrow'); ?>
		</a>
		<div class="topbar__tools">
			<div class="mode-switch" role="group" aria-label="Display mode">
				<button type="button" class="mode-switch__btn" data-mode-set="industry" aria-pressed="true">Interactive</button>
				<button type="button" class="mode-switch__btn" data-mode-set="readable" aria-pressed="false">Readable</button>
			</div>
			<?php echo cwc_text_size_control(); ?>
		</div>
	</div>
</div>

<header class="site-header" id="top">
	<div class="container site-header__inner">
		<a class="brand" href="{{base_url}}">
			<img class="brand__logo" src="gallery/logo-wide.svg" alt="Click With Confidence" width="432" height="72" />
		</a>

		<nav class="site-nav" id="site-nav" aria-label="Main menu">
			<ul class="site-nav__list">
				<?php echo cwc_menu_links($active, 'site-nav__link'); ?>
			</ul>
		</nav>

		<div class="header-tools">
			<button type="button" class="mode-toggle" role="switch" aria-checked="false" data-mode-toggle>
				<span class="mode-toggle__track" aria-hidden="true"><span class="mode-toggle__dot"></span></span>
				<span class="mode-toggle__label">Readable</span>
			</button>
			<?php echo cwc_text_size_control(); ?>
			<button type="button" class="nav-toggle" aria-controls="site-nav" aria-expanded="false" aria-label="Open menu">
				<span class="nav-toggle__bars" aria-hidden="true"><span></span><span></span><span></span></span>
			</button>
		</div>
	</div>
</header>

<main id="main" class="site-main" tabindex="-1">
<?php
}

/** Closes <main> and prints the footer, cookie notice and scripts. */
function cwc_page_end($page = array()) {
	$active = isset($page['active']) ? $page['active'] : '';
?>
</main>

<footer class="site-footer">
	<div class="container site-footer__grid">
		<div class="site-footer__brand">
			<img class="site-footer__shield" src="gallery/logo-shield.svg" alt="" width="72" height="72" loading="lazy" />
			<a class="btn btn--light" href="https://givebutter.com/click-with-confidence"><span>Donate Now!</span></a>
		</div>

		<nav class="site-footer__nav" aria-label="Footer menu">
			<ul>
				<?php echo cwc_menu_links($active, 'site-footer__link'); ?>
			</ul>
		</nav>

		<div class="site-footer__social">
			<p class="site-footer__follow">Follow us on Social Media!</p>
			<a class="social-icon" href="http://instagram.com/clickwithconfidence1"><img src="gallery_gen/9ffdcd79bc98bfee77bc60074021edb8_fit.png?ts=1789585350" alt="Instagram" width="44" height="44" loading="lazy" /></a>
		</div>
	</div>
	<div class="site-footer__base">
		<div class="container">
			<p class="site-footer__email"><a href="mailto:info@clickwithconfidence.org">info@clickwithconfidence.org</a></p>
			<p class="site-footer__hosting"><a href="https://www.kualo.com/free-charity-hosting">Kualo Free Charity Hosting</a></p>
		</div>
	</div>
</footer>

<div class="cookie-notice" role="region" aria-label="Cookie notice" hidden>
	<p class="cookie-notice__text">We use cookies (and gather certain personal information) to provide you with a better online experience. By visiting our website you accept our terms.</p>
	<div class="cookie-notice__actions">
		<button type="button" class="btn btn--ghost btn--sm" data-cookie="reject">Reject</button>
		<button type="button" class="btn btn--primary btn--sm" data-cookie="accept">Got it</button>
	</div>
</div>

<script src="<?php echo cwc_asset('js/cwc.js'); ?>" defer></script>
</body>
</html>
<?php
}
