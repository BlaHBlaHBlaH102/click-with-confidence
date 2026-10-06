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

<section class="page-hero">
	<canvas class="particles" aria-hidden="true"></canvas>
	<div class="hero__orb hero__orb--a" aria-hidden="true"></div>
	<div class="container">
		<h1 class="display page-hero__title reveal">Video Content</h1>
	</div>
</section>

<section class="section section--tight">
	<div class="container">
		<div class="media-stage reveal">
			<div class="media-stage__screen" aria-hidden="true">
				<span class="media-stage__play"><?php echo cwc_icon('play'); ?></span>
				<span class="media-stage__scan"></span>
			</div>
			<div class="media-stage__action">
				<?php /* As on the original site, this button has no link yet. */ ?>
				<a class="btn btn--primary btn--xl"><span>Video Content &amp; Library</span></a>
			</div>
		</div>
	</div>
</section>

<?php cwc_page_end(array('active' => 'video-content'));
