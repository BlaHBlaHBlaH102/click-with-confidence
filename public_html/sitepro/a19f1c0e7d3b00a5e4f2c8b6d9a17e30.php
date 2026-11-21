<?php
// Contact form handler — route: /Contact
// POST: checks the "bring us to your organization" form from the home page and emails it to
// CwC. GET: sends the visitor to the form on the home page.
require_once dirname(__FILE__) . '/cwc.inc.php';

$cwcMailTo = array('viraj.shah.president@clickwithconfidence.org', 'info@clickwithconfidence.org');
$cwcMailFrom = 'info@clickwithconfidence.org'; // an address on the site's own domain, so the host will deliver it
$cwcOrgTypes = array('Senior center', 'Library', 'Assisted or independent living', 'Faith community', 'Community organization', 'School or student group', 'Other');

$cwcBase = isset($GLOBALS['cwcBaseUrl']) ? $GLOBALS['cwcBaseUrl'] : '/';
$cwcWantsJson = (isset($_SERVER['HTTP_X_REQUESTED_WITH']) && $_SERVER['HTTP_X_REQUESTED_WITH'] === 'fetch');

if (!isset($_SERVER['REQUEST_METHOD']) || $_SERVER['REQUEST_METHOD'] !== 'POST') {
	header('Location: ' . $cwcBase . '#contact', true, 303);
	exit;
}

/** One line of plain text: no control characters (stops email header injection), trimmed, length-limited. */
function cwc_line($value, $max) {
	$value = is_string($value) ? $value : '';
	$value = trim(preg_replace('/[\x00-\x1F\x7F]+/', ' ', $value));
	return function_exists('mb_substr') ? mb_substr($value, 0, $max, 'UTF-8') : substr($value, 0, $max);
}

/** Free text: keeps line breaks, drops other control characters. */
function cwc_text($value, $max) {
	$value = is_string($value) ? str_replace("\r\n", "\n", $value) : '';
	$value = trim(preg_replace('/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]+/', '', $value));
	return function_exists('mb_substr') ? mb_substr($value, 0, $max, 'UTF-8') : substr($value, 0, $max);
}

/** At most 5 requests an hour from one address, kept in the server's temp folder. */
function cwc_rate_ok() {
	$ip = isset($_SERVER['REMOTE_ADDR']) ? $_SERVER['REMOTE_ADDR'] : 'unknown';
	$file = rtrim(sys_get_temp_dir(), '/\\') . '/cwc-contact-' . md5($ip) . '.json';
	$now = time();
	$hits = array();
	if (is_file($file)) {
		$data = json_decode((string) @file_get_contents($file), true);
		if (is_array($data)) {
			foreach ($data as $t) {
				if (is_int($t) && $now - $t < 3600) { $hits[] = $t; }
			}
		}
	}
	if (count($hits) >= 5) { return false; }
	$hits[] = $now;
	@file_put_contents($file, json_encode($hits), LOCK_EX);
	return true;
}

$errors = array();
$sent = false;

$in = array(
	'name'      => cwc_line(isset($_POST['name']) ? $_POST['name'] : '', 100),
	'org'       => cwc_line(isset($_POST['org']) ? $_POST['org'] : '', 150),
	'type'      => cwc_line(isset($_POST['type']) ? $_POST['type'] : '', 60),
	'email'     => cwc_line(isset($_POST['email']) ? $_POST['email'] : '', 150),
	'phone'     => cwc_line(isset($_POST['phone']) ? $_POST['phone'] : '', 40),
	'city'      => cwc_line(isset($_POST['city']) ? $_POST['city'] : '', 100),
	'people'    => cwc_line(isset($_POST['people']) ? $_POST['people'] : '', 40),
	'when'      => cwc_line(isset($_POST['when']) ? $_POST['when'] : '', 100),
	'message'   => cwc_text(isset($_POST['message']) ? $_POST['message'] : '', 3000),
);

// Bots fill every field, including the hidden "website" one, and submit instantly.
$honeypot = isset($_POST['website']) ? trim((string) $_POST['website']) : '';
$started = isset($_POST['ts']) ? (int) $_POST['ts'] : 0;
$looksLikeBot = ($honeypot !== '') || ($started > 0 && time() - $started < 3);

if ($in['name'] === '') { $errors[] = 'Please tell us your name.'; }
if ($in['org'] === '') { $errors[] = 'Please tell us the name of your senior center or organization.'; }
if ($in['email'] === '' || !filter_var($in['email'], FILTER_VALIDATE_EMAIL)) { $errors[] = 'Please enter an email address we can reach you at.'; }
if ($in['type'] !== '' && !in_array($in['type'], $cwcOrgTypes, true)) { $in['type'] = 'Other'; }

if (!$errors) {
	if ($looksLikeBot) {
		$sent = true; // look successful to a bot, send nothing
	} elseif (!cwc_rate_ok()) {
		$errors[] = 'We have received several requests from this connection already. Please email info@clickwithconfidence.org instead.';
	} else {
		$lines = array(
			'A new request to bring Click With Confidence to an organization came in through the website.',
			'',
			'Name: ' . $in['name'],
			'Organization: ' . $in['org'],
			'Type: ' . ($in['type'] !== '' ? $in['type'] : '(not given)'),
			'Email: ' . $in['email'],
			'Phone: ' . ($in['phone'] !== '' ? $in['phone'] : '(not given)'),
			'City / town: ' . ($in['city'] !== '' ? $in['city'] : '(not given)'),
			'Expected attendees: ' . ($in['people'] !== '' ? $in['people'] : '(not given)'),
			'Preferred timing: ' . ($in['when'] !== '' ? $in['when'] : '(not given)'),
			'',
			'Message:',
			$in['message'] !== '' ? $in['message'] : '(none)',
			'',
			'Reply to this email to answer ' . $in['name'] . ' directly.',
			'Sent ' . gmdate('Y-m-d H:i') . ' UTC from the Click With Confidence website.',
		);
		$subject = 'Visit request: ' . $in['org'] . ' (' . $in['name'] . ')';
		if (function_exists('mb_encode_mimeheader')) {
			$subject = mb_encode_mimeheader($subject, 'UTF-8', 'B', "\r\n");
		}
		$replyName = str_replace(array('"', '\\'), '', $in['name']);
		$headers = array(
			'From: Click With Confidence Website <' . $cwcMailFrom . '>',
			'Reply-To: "' . $replyName . '" <' . $in['email'] . '>',
			'MIME-Version: 1.0',
			'Content-Type: text/plain; charset=UTF-8',
			'Content-Transfer-Encoding: 8bit',
			'X-Mailer: ClickWithConfidence-website',
		);
		$sent = @mail(implode(', ', $cwcMailTo), $subject, implode("\r\n", $lines), implode("\r\n", $headers), '-f' . $cwcMailFrom);
		if (!$sent) {
			$errors[] = 'Sorry, we could not send your request just now. Please email info@clickwithconfidence.org and we will get back to you.';
		}
	}
}

if ($cwcWantsJson) {
	while (ob_get_level() > 0) { ob_end_clean(); }
	header('Content-Type: application/json; charset=utf-8');
	header('Cache-Control: no-store');
	if ($errors) { http_response_code(400); }
	echo json_encode(array('ok' => !$errors && $sent, 'errors' => $errors));
	exit;
}

// No JavaScript: show the result as a normal page.
cwc_page_start(array(
	'title'       => 'Click With Confidence - Contact Us',
	'description' => 'Contact Click With Confidence to bring us to your senior center or organization.',
	'route'       => 'Contact',
	'active'      => '',
	'bodyClass'   => 'page-contact',
));
?>

<section class="page-band band">
	<canvas class="particles" aria-hidden="true"></canvas>
	<div class="container">
		<h1 class="page-band__title reveal"><?php echo $errors ? 'We could not send that' : 'Thank you'; ?></h1>
	</div>
</section>

<section class="section">
	<div class="container container--text">
		<?php if ($errors): ?>
			<p class="lede">Please go back and check:</p>
			<ul>
				<?php foreach ($errors as $e): ?><li><?php echo cwc_e($e); ?></li><?php endforeach; ?>
			</ul>
			<p><a class="btn btn--primary" href="<?php echo cwc_e($cwcBase); ?>#contact"><span>Back to the form</span></a></p>
		<?php else: ?>
			<p class="lede">Your request has been sent to our team. We will reply to <?php echo cwc_e($in['email']); ?> soon.</p>
			<p><a class="btn btn--primary" href="<?php echo cwc_e($cwcBase); ?>"><span>Back to the home page</span></a></p>
		<?php endif; ?>
	</div>
</section>

<?php cwc_page_end();
