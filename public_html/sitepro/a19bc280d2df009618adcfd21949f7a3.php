<?php
// Flyers & Media Kit — route: /Flyer-Brochure
require_once dirname(__FILE__) . '/cwc.inc.php';
cwc_page_start(array(
	'title'       => 'Click With Confidence - Flyers, Brochure & Media Kit',
	'description' => 'The Click With Confidence media kit, flyer and senior scam prevention brochure.',
	'route'       => 'Flyer-Brochure',
	'active'      => 'flyers',
	'bodyClass'   => 'page-flyer',
));
?>

<section class="page-band band">
	<canvas class="particles" aria-hidden="true"></canvas>
	<div class="container">
		<h1 class="page-band__title reveal">Flyers, Brochure &amp; Media Kit</h1>
	</div>
</section>

<section class="section">
	<div class="container flyers">
		<?php /* Canva embed codes as supplied by CwC. */ ?>
		<div class="canva-embed canva-embed--portrait reveal">
			<h2 class="flyers__title">Media Kit</h2>
			<div style="width: 100%; height: 100%; overflow-y: auto;"><div style="position: relative; width: 100%; height: 0; padding-top: 129.4118%; padding-bottom: 0; box-shadow: 0 2px 8px 0 rgba(63,69,81,0.16); margin-top: 1.6em; margin-bottom: 0.9em; overflow: hidden; border-radius: 8px; will-change: transform;"> <iframe loading="lazy" style="position: absolute; width: 100%; height: 100%; top: 0; left: 0; border: none; padding: 0;margin: 0;" src="https://www.canva.com/design/DAHUFUDNE4s/8FifIxSMiIHTWHSW4qVc5Q/view?embed" allowfullscreen="allowfullscreen" allow="fullscreen" title="CwC media kit"> </iframe> </div> <a href="https://www.canva.com/design/DAHUFUDNE4s/8FifIxSMiIHTWHSW4qVc5Q/view?utm_content=DAHUFUDNE4s&amp;utm_campaign=designshare&amp;utm_medium=embeds&amp;utm_source=link" target="_blank" rel="noopener">CwC media kit</a> by Gold Star</div>
		</div>

		<div class="canva-embed canva-embed--portrait reveal" data-delay="1">
			<h2 class="flyers__title">Flyer</h2>
			<div style="width: 100%; height: 100%; overflow-y: auto;"><div style="position: relative; width: 100%; height: 0; padding-top: 129.4118%; padding-bottom: 0; box-shadow: 0 2px 8px 0 rgba(63,69,81,0.16); margin-top: 1.6em; margin-bottom: 0.9em; overflow: hidden; border-radius: 8px; will-change: transform;"> <iframe loading="lazy" style="position: absolute; width: 100%; height: 100%; top: 0; left: 0; border: none; padding: 0;margin: 0;" src="https://www.canva.com/design/DAG0MjwAEAU/lrq4euUAXgd7y3LwcbqTiw/view?embed" allowfullscreen="allowfullscreen" allow="fullscreen" title="CwC General Flyer"> </iframe> </div> <a href="https://www.canva.com/design/DAG0MjwAEAU/lrq4euUAXgd7y3LwcbqTiw/view?utm_content=DAG0MjwAEAU&amp;utm_campaign=designshare&amp;utm_medium=embeds&amp;utm_source=link" target="_blank" rel="noopener">CwC General Flyer</a> by Gold Star</div>
		</div>

		<div class="canva-embed canva-embed--landscape reveal">
			<h2 class="flyers__title">Brochure</h2>
			<div style="width: 100%; height: 100%; overflow-y: auto;"><div style="position: relative; width: 100%; height: 0; padding-top: 77.2727%; padding-bottom: 0; box-shadow: 0 2px 8px 0 rgba(63,69,81,0.16); margin-top: 1.6em; margin-bottom: 0.9em; overflow: hidden; border-radius: 8px; will-change: transform;"> <iframe loading="lazy" style="position: absolute; width: 100%; height: 100%; top: 0; left: 0; border: none; padding: 0;margin: 0;" src="https://www.canva.com/design/DAG0MzKOxhU/gTz0Y_El3A73D1vd-K0M1A/view?embed" allowfullscreen="allowfullscreen" allow="fullscreen" title="senior scam prevention"> </iframe> </div> <a href="https://www.canva.com/design/DAG0MzKOxhU/gTz0Y_El3A73D1vd-K0M1A/view?utm_content=DAG0MzKOxhU&amp;utm_campaign=designshare&amp;utm_medium=embeds&amp;utm_source=link" target="_blank" rel="noopener">senior scam prevention</a> by Gold Star</div>
		</div>
	</div>
</section>

<?php cwc_page_end(array('active' => 'flyers'));
