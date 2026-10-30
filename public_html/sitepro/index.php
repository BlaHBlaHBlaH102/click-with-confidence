<?php
/**
 * Click With Confidence — page router.
 *
 * Replaces the Site.pro runtime router that used to live in this file. It maps
 * the site's existing URLs to the existing page files in this folder, so every
 * URL, filename and asset path from the original site keeps working unchanged:
 *
 *   /                -> a19e61b70f0e00cc22082eb6eb01d897.php  (Home)
 *   /impact          -> a199bbdbb9df01a697e78bf56eba1508.php
 *   /what-we-do      -> a199bbdbb9df02b8bc6069b318b34b50.php
 *   /leadership      -> a199bbdbb9df035b666498f507ad85ce.php
 *   /presentations   -> a199bbdbb9df043f0f5ce4eb1ecf24f2.php  (Docs & Presentations)
 *   /video-content   -> a199bbdbb9df050f379b945a793a7ba4.php
 *   /App             -> a199dfef8736007e965d9ae3b77376cf.php  (not in the menu)
 *   /Founders-Story  -> a19a0e4884d200534b5bac2b002abb46.php
 *   /Flyer-Brochure  -> a19bc280d2df009618adcfd21949f7a3.php  (Flyers & Media Kit)
 *   /Extension       -> a19f0c1e5b7a00e4c2d9b8a7f6e5d4c3.php  (Chrome Extension)
 *   /privacy-policy  -> a199bbdbb9df00c39633cbfcbc916828.php  (not in the menu)
 *
 * Requests reach this file through public_html/index.php, exactly as before
 * (see public_html/.htaccess and public_html/web.config).
 */

error_reporting(E_ALL & ~E_NOTICE & ~E_DEPRECATED);
@ini_set('display_errors', '0');

$cwcPages = array(
	''               => 'a19e61b70f0e00cc22082eb6eb01d897.php',
	'impact'         => 'a199bbdbb9df01a697e78bf56eba1508.php',
	'what-we-do'     => 'a199bbdbb9df02b8bc6069b318b34b50.php',
	'leadership'     => 'a199bbdbb9df035b666498f507ad85ce.php',
	'presentations'  => 'a199bbdbb9df043f0f5ce4eb1ecf24f2.php',
	'video-content'  => 'a199bbdbb9df050f379b945a793a7ba4.php',
	'App'            => 'a199dfef8736007e965d9ae3b77376cf.php',
	'Founders-Story' => 'a19a0e4884d200534b5bac2b002abb46.php',
	'Flyer-Brochure' => 'a19bc280d2df009618adcfd21949f7a3.php',
	'Extension'      => 'a19f0c1e5b7a00e4c2d9b8a7f6e5d4c3.php',
	'privacy-policy' => 'a199bbdbb9df00c39633cbfcbc916828.php',
);
$cwcNotFoundPage = 'a199bbdbba5a00f7e3efcee9f99665a9.php';

// --- Work out the site's base path and the requested route -------------------

$cwcScriptDir = rtrim(str_replace('\\', '/', dirname(isset($_SERVER['SCRIPT_NAME']) ? $_SERVER['SCRIPT_NAME'] : '/')), '/');
if (substr($cwcScriptDir, -8) === '/sitepro') {
	$cwcScriptDir = substr($cwcScriptDir, 0, -8);
}
$cwcBasePath = $cwcScriptDir . '/';

$cwcHttps = (!empty($_SERVER['HTTPS']) && strtolower($_SERVER['HTTPS']) !== 'off')
	|| (isset($_SERVER['HTTP_X_FORWARDED_PROTO']) && strtolower($_SERVER['HTTP_X_FORWARDED_PROTO']) === 'https')
	|| (isset($_SERVER['SERVER_PORT']) && (int) $_SERVER['SERVER_PORT'] === 443);
$cwcHost = isset($_SERVER['HTTP_HOST']) ? $_SERVER['HTTP_HOST'] : '';
if (!preg_match('/^[A-Za-z0-9.\-]+(:\d+)?$/', $cwcHost)) {
	$cwcHost = 'clickwithconfidence.org';
}
$cwcBaseUrl = ($cwcHttps ? 'https://' : 'http://') . $cwcHost . $cwcBasePath;

$cwcViaIis = isset($_SERVER['SCRIPT_NAME']) && substr(str_replace('\\', '/', $_SERVER['SCRIPT_NAME']), -18) === '/sitepro/index.php';
if ($cwcViaIis && isset($_GET['route'])) {
	// IIS (web.config) rewrites to sitepro/?route=<path>
	$cwcRoute = (string) $_GET['route'];
} else {
	$cwcUriPath = isset($_SERVER['REQUEST_URI']) ? (string) $_SERVER['REQUEST_URI'] : '/';
	$cwcQueryPos = strpos($cwcUriPath, '?');
	if ($cwcQueryPos !== false) {
		$cwcUriPath = substr($cwcUriPath, 0, $cwcQueryPos);
	}
	$cwcUriPath = rawurldecode($cwcUriPath);
	$cwcRoute = (strpos($cwcUriPath, $cwcBasePath) === 0) ? substr($cwcUriPath, strlen($cwcBasePath)) : ltrim($cwcUriPath, '/');
}
$cwcRoute = trim($cwcRoute, '/');
if ($cwcRoute === 'index.php' || $cwcRoute === 'index.html') {
	$cwcRoute = '';
}

// --- sitemap.xml (generated from the original template) ----------------------

if ($cwcRoute === 'sitemap.xml') {
	header('Content-Type: application/xml; charset=utf-8');
	echo str_replace('{{base_url}}', htmlspecialchars($cwcBaseUrl, ENT_XML1), file_get_contents(__DIR__ . '/sitemap_template'));
	exit;
}

// --- Resolve the page --------------------------------------------------------

$cwcStatus = 200;
if (isset($cwcPages[$cwcRoute])) {
	$cwcPageFile = $cwcPages[$cwcRoute];
} else {
	// Forgive differences in letter case (e.g. /app or /founders-story) with a
	// permanent redirect to the original address.
	foreach ($cwcPages as $cwcAlias => $cwcFile) {
		if ($cwcAlias !== '' && strcasecmp($cwcAlias, $cwcRoute) === 0) {
			$cwcQuery = isset($_SERVER['QUERY_STRING']) && $_SERVER['QUERY_STRING'] !== '' ? '?' . $_SERVER['QUERY_STRING'] : '';
			header('Location: ' . $cwcBaseUrl . $cwcAlias . $cwcQuery, true, 301);
			exit;
		}
	}
	$cwcStatus = 404;
	$cwcPageFile = $cwcNotFoundPage;
}

// --- Render ------------------------------------------------------------------

// Only known addresses are echoed back into the page (og:url); never raw request text.
$cwcCurrUrl = $cwcBaseUrl . ($cwcStatus === 200 ? array_search($cwcPageFile, $cwcPages, true) : '');

if ($cwcStatus === 404) {
	http_response_code(404);
}
header('Content-Type: text/html; charset=utf-8');
header('X-Content-Type-Options: nosniff');
header('Referrer-Policy: strict-origin-when-cross-origin');

ob_start();
include __DIR__ . '/' . $cwcPageFile;
$cwcHtml = ob_get_clean();

echo str_replace(
	array('{{base_url}}', '{{curr_url}}', '{{hr_out}}'),
	array(htmlspecialchars($cwcBaseUrl, ENT_QUOTES, 'UTF-8'), htmlspecialchars($cwcCurrUrl, ENT_QUOTES, 'UTF-8'), ''),
	$cwcHtml
);
