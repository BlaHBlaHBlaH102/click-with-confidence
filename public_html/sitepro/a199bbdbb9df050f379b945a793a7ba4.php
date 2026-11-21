<?php
// Video Content — route: /video-content
require_once dirname(__FILE__) . '/cwc.inc.php';
cwc_page_start(array(
	'title'       => 'Click With Confidence - Video Content',
	'description' => 'Click With Confidence - Video Content',
	'route'       => 'video-content',
	'active'      => 'video-content',
	'bodyClass'   => 'page-video',
));
?>

<section class="page-band band">
	<canvas class="particles" aria-hidden="true"></canvas>
	<div class="container">
		<h1 class="page-band__title reveal">Video Content</h1>
	</div>
</section>

<?php
/* Videos live in gallery/videos/ (clipN.mp4 + clipN.jpg poster). Edit titles here. */
$videos = array(
	array('file' => 'clip1', 'title' => 'Video 1'),
	array('file' => 'clip2', 'title' => 'Video 2: Three tips to avoid scams'),
	array('file' => 'clip3', 'title' => 'Video 3'),
);
$total = count($videos);
?>
<section class="section">
	<div class="container">
		<div class="vcar reveal" data-vcar role="region" aria-roledescription="carousel" aria-label="Video library">
			<button type="button" class="vcar__nav vcar__nav--prev" data-vcar-prev aria-label="Previous video" hidden>
				<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 5l-7 7 7 7"/></svg>
			</button>
			<ul class="vcar__track" data-vcar-track>
<?php foreach ($videos as $i => $v) { ?>
				<li class="vcar__slide" role="group" aria-roledescription="slide" aria-label="<?php echo ($i + 1) . ' of ' . $total; ?>">
					<video class="vcar__video" controls playsinline preload="none" poster="<?php echo cwc_asset('gallery/videos/' . $v['file'] . '.jpg'); ?>" aria-label="<?php echo htmlspecialchars($v['title']); ?>">
						<source src="<?php echo cwc_asset('gallery/videos/' . $v['file'] . '.mp4'); ?>" type="video/mp4">
						Your browser can't play this video.
					</video>
					<p class="vcar__caption"><?php echo htmlspecialchars($v['title']); ?></p>
				</li>
<?php } ?>
			</ul>
			<button type="button" class="vcar__nav vcar__nav--next" data-vcar-next aria-label="Next video" hidden>
				<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 5l7 7-7 7"/></svg>
			</button>
			<div class="vcar__dots" data-vcar-dots hidden>
<?php foreach ($videos as $i => $v) { ?>
				<button type="button" class="vcar__dot" aria-label="Go to video <?php echo $i + 1; ?>"></button>
<?php } ?>
			</div>
		</div>
	</div>
</section>

<script defer src="<?php echo cwc_asset('js/video-carousel.js'); ?>"></script>

<?php cwc_page_end(array('active' => 'video-content'));
