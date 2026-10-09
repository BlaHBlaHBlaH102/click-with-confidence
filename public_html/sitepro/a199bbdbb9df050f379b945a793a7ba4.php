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

<section class="section">
	<div class="container container--text">
		<div class="media-panel reveal">
			<span class="media-panel__icon" aria-hidden="true"><?php echo cwc_icon('play'); ?></span>
			<?php /* As on the original site, this button has no link yet. */ ?>
			<a class="btn btn--light btn--lg"><span>Video Content &amp; Library</span></a>
		</div>
	</div>
</section>

<?php cwc_page_end(array('active' => 'video-content'));
