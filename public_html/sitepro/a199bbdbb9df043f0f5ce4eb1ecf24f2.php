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
?>

<section class="page-hero">
	<canvas class="particles" aria-hidden="true"></canvas>
	<div class="hero__orb hero__orb--a" aria-hidden="true"></div>
	<div class="container">
		<h1 class="display page-hero__title reveal">Docs &amp; Presentations</h1>
		<div class="page-hero__actions reveal" data-delay="1">
			<a class="btn btn--primary btn--lg btn--glow" href="https://drive.google.com/file/d/1EBpNM_azFYX58_hiET7rSiJ2orIfdnXC/view?usp=sharing"><?php echo cwc_icon('download'); ?><span>Download the CWC Report!</span></a>
		</div>
	</div>
</section>

<section class="section section--tight decks">
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

<?php cwc_page_end(array('active' => 'presentations'));
