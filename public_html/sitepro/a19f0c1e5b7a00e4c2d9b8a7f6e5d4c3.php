<?php
// Chrome Extension — route: /Extension
require_once dirname(__FILE__) . '/cwc.inc.php';
cwc_page_start(array(
	'title'       => 'Click With Confidence - Chrome Extension',
	'description' => 'The free Click With Confidence Chrome extension checks emails in Gmail and Outlook and warns you in plain language when one looks like a scam.',
	'route'       => 'Extension',
	'active'      => 'extension',
	'bodyClass'   => 'page-extension',
));

$cwcStoreUrl = 'https://chromewebstore.google.com/detail/click-with-confidence/oclpjnggcfcebbkmnifhocnaallljhpa';

// Screenshots of the extension: file, width, height, description.
$cwcExtShots = array(
	array('gallery/extension/extension-welcome.png',   492, 791, 'Welcome screen: choose Manual Mode or Automatic Mode'),
	array('gallery/extension/extension-manual.png',    530, 408, 'Manual Mode: press Scan This Email to check the email you have open'),
	array('gallery/extension/extension-result.png',    470, 788, 'A risk score of 94 with the plain-language warning "This looks like a scam!"'),
	array('gallery/extension/extension-automatic.png', 532, 495, 'Automatic Mode: "Watching your inbox" while emails are checked in the background'),
	array('gallery/extension/extension-settings.png',  531, 706, 'Settings: scan mode and the alert sensitivity slider'),
);
?>

<section class="page-band band">
	<canvas class="particles" aria-hidden="true"></canvas>
	<div class="container">
		<h1 class="page-band__title reveal">CHROME EXTENSION</h1>
		<div class="page-band__actions reveal" data-delay="1">
			<a class="btn btn--light btn--lg" href="<?php echo $cwcStoreUrl; ?>" target="_blank" rel="noopener"><?php echo cwc_icon('download'); ?><span>Add to Chrome &mdash; it&rsquo;s free</span></a>
		</div>
	</div>
</section>

<section class="section">
	<div class="container">
		<p class="lede ext-intro reveal">The Click With Confidence Chrome extension checks the emails you open in Gmail or Outlook and gives each one a risk score, with a short explanation in plain language. If something looks like a scam, you will know before you click. <span class="badge-soon">FREE FOR EVERYONE</span></p>

		<ol class="ext-steps" role="list">
			<li class="ext-step reveal">
				<span class="ext-step__num" aria-hidden="true">1</span>
				<h2 class="ext-step__title">Add it to Chrome</h2>
				<p>Install the extension from the Chrome Web Store. It takes a few seconds and costs nothing.</p>
			</li>
			<li class="ext-step reveal" data-delay="1">
				<span class="ext-step__num" aria-hidden="true">2</span>
				<h2 class="ext-step__title">Choose how it works</h2>
				<p><strong>Manual Mode:</strong> you press &ldquo;Scan&rdquo; when you want an email checked. <strong>Automatic Mode:</strong> emails are checked as you open them.</p>
			</li>
			<li class="ext-step reveal" data-delay="2">
				<span class="ext-step__num" aria-hidden="true">3</span>
				<h2 class="ext-step__title">Know before you click</h2>
				<p>Every email gets a score from Safe to Danger and a plain explanation. You choose how sensitive the alerts are in Settings.</p>
			</li>
		</ol>

		<div class="ext-cta reveal">
			<a class="btn btn--primary btn--lg" href="<?php echo $cwcStoreUrl; ?>" target="_blank" rel="noopener"><span>Get the extension</span><?php echo cwc_icon('arrow'); ?></a>
		</div>
	</div>
</section>

<section class="section ext-shots">
	<div class="container">
		<h2 class="ext-shots__title reveal">See how it looks</h2>
		<ul class="ext-gallery" role="list" data-lightbox>
			<?php foreach ($cwcExtShots as $i => $s): ?>
			<li class="ext-gallery__item reveal" data-delay="<?php echo $i % 3; ?>">
				<a class="masonry__link ext-gallery__link" href="<?php echo $s[0]; ?>" data-full-w="<?php echo $s[1]; ?>" data-full-h="<?php echo $s[2]; ?>">
					<img src="<?php echo $s[0]; ?>" alt="Click With Confidence extension: <?php echo cwc_e($s[3]); ?>" width="<?php echo $s[1]; ?>" height="<?php echo $s[2]; ?>" loading="lazy" />
				</a>
				<p class="ext-gallery__caption"><?php echo cwc_e($s[3]); ?></p>
			</li>
			<?php endforeach; ?>
		</ul>
	</div>
</section>

<?php cwc_page_end(array('active' => 'extension'));
