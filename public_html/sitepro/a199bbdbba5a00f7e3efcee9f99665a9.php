<?php
// Custom 404 page — shown by index.php for any address that isn't a page.
require_once dirname(__FILE__) . '/cwc.inc.php';
cwc_page_start(array(
	'title'       => 'Custom 404 page',
	'description' => 'Custom 404 page',
	'route'       => '',
	'active'      => '',
	'bodyClass'   => 'page-404',
));
?>

<section class="page-hero page-hero--full">
	<canvas class="particles" aria-hidden="true"></canvas>
	<div class="hero__orb hero__orb--a" aria-hidden="true"></div>
	<div class="container">
		<p class="display page-hero__code reveal" aria-hidden="true">404</p>
		<h1 class="page-hero__title page-hero__title--sm reveal" data-delay="1">Not found</h1>
		<div class="page-hero__actions reveal" data-delay="2">
			<a class="btn btn--primary btn--lg" href="{{base_url}}"><span>Home</span></a>
		</div>
	</div>
</section>

<?php cwc_page_end();
