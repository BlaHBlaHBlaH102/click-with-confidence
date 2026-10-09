<?php
// What We Do — route: /what-we-do
require_once dirname(__FILE__) . '/cwc.inc.php';
cwc_page_start(array(
	'title'       => 'Click With Confidence - What We Do',
	'description' => 'Click With Confidence - What We Do',
	'route'       => 'what-we-do',
	'active'      => 'what-we-do',
	'bodyClass'   => 'page-what-we-do',
));
?>

<section class="page-band band">
	<canvas class="particles" aria-hidden="true"></canvas>
	<div class="container">
		<h1 class="page-band__title reveal">Our Story &amp; What We Do</h1>
	</div>
</section>

<section class="section">
	<div class="container container--text">
		<p class="lede reveal">Click with Confidence was founded in 2025 by Viraj Shah. He has been running Click with Confidence in some form since 2022. He was inspired to start the initiative by his grandfather, who unfortunately got scammed, leading his once-successful accounting business to bankruptcy in the span of a few days. Shocked by this event and illuminated by the fact that <strong class="mark">seniors lose 61.5 Billion Dollars </strong>to scams every single year, he decided to create Click with Confidence.</p>
	</div>
</section>

<section class="section section--tint goals">
	<div class="container">
		<h2 class="h2 h2--center reveal">Goals</h2>
		<div class="goals__grid">
			<article class="card goal-card reveal">
				<figure class="card__media">
					<img src="gallery_gen/73046c04d8e0b0d93e835fc70fb3a967_846x922_fit.jpg?ts=1789585350" alt="A student helping a senior at a senior living community" width="846" height="922" loading="lazy" />
				</figure>
				<div class="card__body">
					<h3 class="h3">Educate</h3>
					<p>We want to educate thousand's of people on how to identify scam calls, practical digital safety, and protecting data from hackers.</p>
				</div>
			</article>
			<article class="card goal-card reveal" data-delay="1">
				<figure class="card__media">
					<img src="gallery_gen/597e2751a9d9532f6793919cb8a19095_846x924_fit.jpg?ts=1789585350" alt="A presentation titled How to Shop Safely Online in front of an audience of seniors" width="846" height="924" loading="lazy" />
				</figure>
				<div class="card__body">
					<h3 class="h3">Prevention</h3>
					<p>We want to prevent scams from happening to elders by talking about digital security basics, smart behavior online, and awareness.</p>
				</div>
			</article>
			<article class="card goal-card reveal" data-delay="2">
				<figure class="card__media">
					<img src="gallery_gen/5977dc3c1b06783b1aba26096a519dd1_846x924_fit.jpg?ts=1789585350" alt="A student speaking with a group of seniors" width="846" height="924" loading="lazy" />
				</figure>
				<div class="card__body">
					<h3 class="h3">Support</h3>
					<p>Provide advocacy for victims, immediate help, and emotional support through peer support.</p>
				</div>
			</article>
		</div>
	</div>
</section>

<?php cwc_page_end(array('active' => 'what-we-do'));
