<?php
// Docs & Presentations — route: /presentations
require_once dirname(__FILE__) . '/cwc.inc.php';
cwc_page_start(array(
	'title'       => 'Click With Confidence - Presentations',
	'description' => 'Click With Confidence - Presentations',
	'route'       => 'presentations',
	'active'      => 'presentations',
	'bodyClass'   => 'page-presentations',
));

// The original Google Slides embed code, unchanged, in the original order.
// (A shared .embed wrapper makes each one resize with the screen.)
$cwcPublishedDecks = array(
	'<div style="width: 100%; height: 100%; overflow-y: auto;"><iframe src="https://docs.google.com/presentation/d/e/2PACX-1vTJiq2ipJugDfcff7vKRfZF2b4MpydtUHE73fKxsIYgnrbYRIqeW9Qv6Z8uFJbEHOvgzYQAndyRGg2Z/pubembed?start=false&amp;loop=false&amp;delayms=3000" frameborder="0" width="960" height="569" allowfullscreen="true" mozallowfullscreen="true" webkitallowfullscreen="true" loading="lazy" title="Presentation"></iframe></div>',
	'<div style="width: 100%; height: 100%; overflow-y: auto;"><iframe src="https://docs.google.com/presentation/d/e/2PACX-1vSShFGNEXJGpVZ04P9NDzOvXMdMxjSjZW5eljV5FTVW7ADAgDh2IGVlaRgRnZREeuZh5VbwNFECnJVj/pubembed?start=false&amp;loop=false&amp;delayms=3000" frameborder="0" width="960" height="569" allowfullscreen="true" mozallowfullscreen="true" webkitallowfullscreen="true" loading="lazy" title="Presentation"></iframe></div>',
	'<div style="width: 100%; height: 100%; overflow-y: auto;"><iframe src="https://docs.google.com/presentation/d/e/2PACX-1vQ7NchD37ZHNu6tlpSKNmDoPPSw8pzhnM6YNtbYLeVLcLsjaOgLuKuk4svCofsI7O-GfQ9YVgX9uDyu/pubembed?start=false&amp;loop=false&amp;delayms=3000" frameborder="0" width="960" height="569" allowfullscreen="true" mozallowfullscreen="true" webkitallowfullscreen="true" loading="lazy" title="Presentation"></iframe></div>',
	'<div style="width: 100%; height: 100%; overflow-y: auto;"><iframe src="https://docs.google.com/presentation/d/e/2PACX-1vSjgkVJJvCfhZWNTPbWuzys0WciQeYjbIpEIOeaIQYdFwlVBpVtf0vk5w__onfXTk_9DgEpx0lKd5He/pubembed?start=false&amp;loop=false&amp;delayms=3000" frameborder="0" width="960" height="569" allowfullscreen="true" mozallowfullscreen="true" webkitallowfullscreen="true" loading="lazy" title="Presentation"></iframe></div>',
	'<div style="width: 100%; height: 100%; overflow-y: auto;"><iframe src="https://docs.google.com/presentation/d/e/2PACX-1vQgi8ZMRGCT2CW15UMzK6tFOZ0zOjyPxYGsWdY_VgUNXTsIwzsoyzlKxCnhNMS6uGbDkXUIfcXRLH9x/pubembed?start=false&amp;loop=false&amp;delayms=3000" frameborder="0" width="960" height="569" allowfullscreen="true" mozallowfullscreen="true" webkitallowfullscreen="true" loading="lazy" title="Presentation"></iframe></div>',
);

$cwcSlideDecks = array(
	'<div style="width: 100%; height: 100%; overflow-y: auto;"><iframe src="//docs.google.com/presentation/d/1-KkrFG-WmNM0B0WBdPs7_n1MqmdZr1-bpuumkp8iNNM/embed" style="width: 100%; height: 100%; display: block; border-radius: 2px; border: 1px solid #E0E0E0;" loading="lazy" title="Presentation"></iframe></div>',
	/*
	 * Not shown: on the old page this embed's code was cut off, so visitors saw its address as stray
	 * text rather than a slideshow. When repaired it shows an "IRS scams" deck that looks like the one
	 * below. To show it, move this line out of the comment:
	 *
	 * '<div style="width: 100%; height: 100%; overflow-y: auto;"><iframe src="https://docs.google.com/presentation/d/e/2PACX-1vRC9U_YIN2x9XXwiVir9Vu911zokkne9RhmuOG5geOVLdztkQodHu4mVSQPTCLrIztTThF1-G5LleRG/pubembed?start=false&amp;loop=false&amp;delayms=3000" frameborder="0" width="1440" height="839" allowfullscreen="true" mozallowfullscreen="true" webkitallowfullscreen="true" loading="lazy" title="Presentation"></iframe></div>',
	 */
	'<div style="width: 100%; height: 100%; overflow-y: auto;"><iframe src="//docs.google.com/presentation/d/10Dgx1RiJUvaI75dDoiSI8ugvNbkhRwQPJvNhLkWNnt0/embed" style="width: 100%; height: 100%; display: block; border-radius: 2px; border: 1px solid #E0E0E0;" loading="lazy" title="Presentation"></iframe></div>',
	'<div style="width: 100%; height: 100%; overflow-y: auto;"><iframe src="//docs.google.com/presentation/d/1hXXBMyc7Wc8Y4WDPfRl1rQ7L10aossCxRAVrNCDfbgQ/embed" style="width: 100%; height: 100%; display: block; border-radius: 2px; border: 1px solid #E0E0E0;" loading="lazy" title="Presentation"></iframe></div>',
	'<div style="width: 100%; height: 100%; overflow-y: auto;"><iframe src="//docs.google.com/presentation/d/1k5DHqS8RA0p3yOrLo-7nllk8brWhf3k4YusPQCfU_84/embed" style="width: 100%; height: 100%; display: block; border-radius: 2px; border: 1px solid #E0E0E0;" loading="lazy" title="Presentation"></iframe></div>',
	'<div style="width: 100%; height: 100%; overflow-y: auto;"><iframe src="//docs.google.com/presentation/d/1tz878i9JgPf6_qcm71qH9VbgxRGHxDlQDISoHAQr1cw/embed" style="width: 100%; height: 100%; display: block; border-radius: 2px; border: 1px solid #E0E0E0;" loading="lazy" title="Presentation"></iframe></div>',
	'<div style="width: 100%; height: 100%; overflow-y: auto;"><iframe src="//docs.google.com/presentation/d/1_ke0DOFQhnux9FUO5yN0hK6uhUwm5BV5OcWfLCtSPO8/embed" style="width: 100%; height: 100%; display: block; border-radius: 2px; border: 1px solid #E0E0E0;" loading="lazy" title="Presentation"></iframe></div>',
);

// The CWC Fraud & Scam Patterns Insights Report, read in the page-flip viewer (js/pdf-viewer.js).
$cwcReportFile = 'gallery/CWC Fraud  Scam Patterns Insights Report 2026.pdf';
$cwcReportUrl = str_replace('%2F', '/', rawurlencode($cwcReportFile));
$cwcReportSize = is_file(dirname(__FILE__) . '/' . $cwcReportFile) ? round(filesize(dirname(__FILE__) . '/' . $cwcReportFile) / 1048576, 1) . ' MB' : '';
?>

<section class="page-band band">
	<canvas class="particles" aria-hidden="true"></canvas>
	<div class="container">
		<h1 class="page-band__title reveal">Docs &amp; Presentations</h1>
		<div class="page-band__actions reveal" data-delay="1">
			<a class="btn btn--light" href="<?php echo $cwcReportUrl; ?>" download><?php echo cwc_icon('download'); ?><span>Download the CWC Report!</span></a>
		</div>
	</div>
</section>

<section class="section reader-section" id="report">
	<div class="container">
		<h2 class="reader-section__title reveal">CWC Fraud &amp; Scam Patterns Insights Report 2026</h2>

		<div class="reader" data-pdf="<?php echo cwc_e($cwcReportUrl); ?>" data-worker="<?php echo cwc_asset('js/vendor/pdf.worker.min.js'); ?>">
			<div class="reader__bar">
				<button type="button" class="reader__btn reader__btn--thumbs" data-reader="thumbs" aria-pressed="true" aria-label="Show page thumbnails" title="Thumbnails">
					<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3.5" y="4" width="7" height="7" rx="1"/><rect x="13.5" y="4" width="7" height="7" rx="1"/><rect x="3.5" y="14" width="7" height="7" rx="1"/><rect x="13.5" y="14" width="7" height="7" rx="1"/></svg>
				</button>
				<div class="reader__nav">
					<button type="button" class="reader__btn" data-reader="prev" aria-label="Previous page" title="Previous page"><svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 5l-7 7 7 7"/></svg></button>
					<label class="reader__pager">
						<span class="sr-only">Go to page</span>
						<input class="reader__page-input" type="number" inputmode="numeric" min="1" max="1" value="1" />
						<span class="reader__of" aria-hidden="true">/</span>
						<span class="reader__page-total">&ndash;</span>
					</label>
					<button type="button" class="reader__btn" data-reader="next" aria-label="Next page" title="Next page"><svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 5l7 7-7 7"/></svg></button>
				</div>
				<div class="reader__tools">
					<button type="button" class="reader__btn" data-reader="full" aria-label="Full screen" title="Full screen"><svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5"/></svg></button>
					<a class="reader__btn reader__btn--text" href="<?php echo $cwcReportUrl; ?>" download title="Download the report (PDF<?php echo $cwcReportSize ? ', ' . $cwcReportSize : ''; ?>)"><?php echo cwc_icon('download'); ?><span>Download</span></a>
				</div>
			</div>

			<div class="reader__body">
				<div class="reader__thumbs" role="group" aria-label="Page thumbnails"></div>
				<div class="reader__stage">
					<div class="reader__book"></div>
					<p class="reader__loading" role="status">Loading the report&hellip;</p>
					<p class="reader__error">The reader could not load. <a href="<?php echo $cwcReportUrl; ?>">Open or download the report (PDF)</a> instead.</p>
				</div>
			</div>

			<div class="reader__foot">
				<input class="reader__slider" type="range" min="1" max="1" value="1" step="1" aria-label="Page slider" />
				<p class="reader__status sr-only" aria-live="polite"></p>
			</div>

			<noscript><p class="reader__nojs"><a href="<?php echo $cwcReportUrl; ?>">Open or download the report (PDF)</a></p></noscript>
		</div>
	</div>
</section>

<section class="section decks">
	<div class="container">
		<div class="deck-grid">
			<?php foreach ($cwcPublishedDecks as $i => $embed): ?>
			<div class="embed embed--slides reveal" data-delay="<?php echo $i % 2; ?>"><?php echo $embed; ?></div>
			<?php endforeach; ?>
		</div>

		<hr class="divider" />

		<div class="deck-grid">
			<?php foreach ($cwcSlideDecks as $i => $embed): ?>
			<div class="embed embed--slides reveal" data-delay="<?php echo $i % 2; ?>"><?php echo $embed; ?></div>
			<?php endforeach; ?>
		</div>
	</div>
</section>

<script defer src="<?php echo cwc_asset('js/vendor/pdf.min.js'); ?>"></script>
<script defer src="<?php echo cwc_asset('js/vendor/page-flip.browser.js'); ?>"></script>
<script defer src="<?php echo cwc_asset('js/pdf-viewer.js'); ?>"></script>

<?php cwc_page_end(array('active' => 'presentations'));
