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

<section class="page-band band page-band--tall">
	<canvas class="particles" aria-hidden="true"></canvas>
	<div class="container">
		<p class="page-band__code reveal" aria-hidden="true">404</p>
		<h1 class="page-band__title reveal" data-delay="1">Not found</h1>
		<div class="page-band__actions reveal" data-delay="2">
			<a class="btn btn--light" href="{{base_url}}"><span>Home</span></a>
		</div>
	</div>
</section>

<?php cwc_page_end();
