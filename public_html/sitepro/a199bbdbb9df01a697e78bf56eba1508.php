<?php
// Impact — route: /impact
require_once dirname(__FILE__) . '/cwc.inc.php';
cwc_page_start(array(
	'title'       => 'Click With Confidence - Impact',
	'description' => 'Click With Confidence - Impact',
	'route'       => 'impact',
	'active'      => 'impact',
	'bodyClass'   => 'page-impact',
));
?>

<section class="page-hero">
	<canvas class="particles" aria-hidden="true"></canvas>
	<div class="hero__orb hero__orb--a" aria-hidden="true"></div>
	<div class="container">
		<h1 class="display page-hero__title reveal">Impact</h1>
	</div>
</section>

<section class="section section--tight">
	<div class="container">
		<div class="embed embed--sheet reveal">
			<div style="width: 100%; height: 100%; overflow-y: auto;"><iframe src="https://docs.google.com/spreadsheets/d/e/2PACX-1vShiAu4qHRqwfyqfScfmUcn_KOQOG0EfajoZiFxEo1j1xGfh_8l5iISgGzNZFfCRcU0MgVhWR8SQr3p/pubhtml?widget=true&amp;headers=false" title="Impact" loading="lazy"></iframe></div>
		</div>
	</div>
</section>

<section class="section stats-section">
	<div class="container stats">
		<div class="stat reveal">
			<h2 class="stat__text">we have reached <span class="stat__num" data-count="1500">1,500+</span> seniors</h2>
		</div>
		<div class="stat reveal" data-delay="1">
			<h2 class="stat__text">we have done <span class="stat__num" data-count="50">50+</span> presentations</h2>
		</div>
	</div>
</section>

<?php cwc_page_end(array('active' => 'impact'));
