<?php
// Flyer & Brochure — route: /Flyer-Brochure (reachable directly; intentionally not in the main menu)
require_once dirname(__FILE__) . '/cwc.inc.php';
cwc_page_start(array(
	'title'       => 'Flyer & Brochure',
	'description' => 'Flyer & Brochure',
	'route'       => 'Flyer-Brochure',
	'active'      => '',
	'bodyClass'   => 'page-flyer',
));
?>

<section class="page-hero">
	<canvas class="particles" aria-hidden="true"></canvas>
	<div class="hero__orb hero__orb--a" aria-hidden="true"></div>
	<div class="container">
		<h1 class="display page-hero__title reveal">Flyer &amp; Brochure</h1>
	</div>
</section>

<section class="section section--tight">
	<div class="container flyers">
		<?php /* Original Canva embed code, unchanged. */ ?>
		<div class="canva-embed canva-embed--portrait reveal">
			<div style="width: 100%; height: 100%; overflow-y: auto;"><div style="position: relative; width: 100%; height: 0; padding-top: 129.4118%; padding-bottom: 0; box-shadow: 0 2px 8px 0 rgba(63,69,81,0.16); margin-top: 1.6em; margin-bottom: 0.9em; overflow: hidden; border-radius: 8px; will-change: transform;"> <iframe loading="lazy" style="position: absolute; width: 100%; height: 100%; top: 0; left: 0; border: none; padding: 0;margin: 0;" src="https://www.canva.com/design/DAG0MjwAEAU/lrq4euUAXgd7y3LwcbqTiw/view?embed" allowfullscreen="allowfullscreen" allow="fullscreen" title="CwC General Flyer"> </iframe> </div> <a href="https://www.canva.com/design/DAG0MjwAEAU/lrq4euUAXgd7y3LwcbqTiw/view?utm_content=DAG0MjwAEAU&amp;utm_campaign=designshare&amp;utm_medium=embeds&amp;utm_source=link" target="_blank" rel="noopener">CwC General Flyer</a> by Gold Star</div>
		</div>

		<div class="canva-embed canva-embed--landscape reveal" data-delay="1">
			<div style="width: 100%; height: 100%; overflow-y: auto;"><div style="position: relative; width: 100%; height: 0; padding-top: 77.2727%; padding-bottom: 0; box-shadow: 0 2px 8px 0 rgba(63,69,81,0.16); margin-top: 1.6em; margin-bottom: 0.9em; overflow: hidden; border-radius: 8px; will-change: transform;"> <iframe loading="lazy" style="position: absolute; width: 100%; height: 100%; top: 0; left: 0; border: none; padding: 0;margin: 0;" src="https://www.canva.com/design/DAG0MzKOxhU/gTz0Y_El3A73D1vd-K0M1A/view?embed" allowfullscreen="allowfullscreen" allow="fullscreen" title="senior scam prevention"> </iframe> </div> <a href="https://www.canva.com/design/DAG0MzKOxhU/gTz0Y_El3A73D1vd-K0M1A/view?utm_content=DAG0MzKOxhU&amp;utm_campaign=designshare&amp;utm_medium=embeds&amp;utm_source=link" target="_blank" rel="noopener">senior scam prevention</a> by Gold Star</div>
		</div>
	</div>
</section>

<?php cwc_page_end();
