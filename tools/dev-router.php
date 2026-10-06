<?php
/**
 * Local development router for PHP's built-in web server.
 *
 * The production site runs on Apache (cPanel), where public_html/.htaccess
 * rewrites every request that isn't a real file into sitepro/. PHP's built-in
 * server ignores .htaccess, so this script reproduces those same rules:
 *
 *   1. A real file under public_html/        -> served as-is
 *   2. A real file under public_html/sitepro -> served as-is (gallery/, css/, js/, fonts/ ...)
 *   3. Anything else                         -> public_html/index.php (the page router)
 *
 * Usage (from the repository root):
 *   php -S 127.0.0.1:8080 -t public_html tools/dev-router.php
 *
 * This file is NOT uploaded to the server.
 */

$root = realpath(__DIR__ . '/../public_html');
$path = rawurldecode(parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH));

// Mirror sitepro/.htaccess: builder data files are never served directly.
$blocked = '#/(?:store\.log|store\.dat|store\.json|store_orders\.log|invoice-series\.json|ga_code|data\.json|forms\.log|project\.db|[^./]+\.dat)$#';

$serveStatic = function ($file) {
	$types = array(
		'css' => 'text/css', 'js' => 'application/javascript', 'json' => 'application/json',
		'svg' => 'image/svg+xml', 'png' => 'image/png', 'jpg' => 'image/jpeg', 'jpeg' => 'image/jpeg',
		'gif' => 'image/gif', 'webp' => 'image/webp', 'ico' => 'image/x-icon', 'pdf' => 'application/pdf',
		'woff2' => 'font/woff2', 'woff' => 'font/woff', 'ttf' => 'font/ttf', 'otf' => 'font/otf',
		'eot' => 'application/vnd.ms-fontobject', 'html' => 'text/html; charset=utf-8',
		'xml' => 'application/xml', 'txt' => 'text/plain',
	);
	$ext = strtolower(pathinfo($file, PATHINFO_EXTENSION));
	header('Content-Type: ' . (isset($types[$ext]) ? $types[$ext] : 'application/octet-stream'));
	header('Content-Length: ' . filesize($file));
	readfile($file);
	return true;
};

if (!preg_match($blocked, $path)) {
	if ($path !== '/' && is_file($root . $path) && substr($path, -4) !== '.php') {
		return false;
	}
	if ($path !== '/' && is_file($root . '/sitepro' . $path) && substr($path, -4) !== '.php') {
		return $serveStatic($root . '/sitepro' . $path);
	}
}

$_SERVER['SCRIPT_NAME'] = '/index.php';
$_SERVER['SCRIPT_FILENAME'] = $root . '/index.php';
chdir($root);
require $root . '/index.php';
