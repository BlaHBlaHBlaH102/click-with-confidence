<?php
// Custom Maintenance page — kept from the original site; not linked to any address.
require_once dirname(__FILE__) . '/cwc.inc.php';
cwc_page_start(array(
	'title'       => 'Custom Maintenance page',
	'description' => 'Custom Maintenance page',
	'route'       => '',
	'active'      => '',
	'bodyClass'   => 'page-maintenance',
));
?>

<section class="page-hero page-hero--full">
	<canvas class="particles" aria-hidden="true"></canvas>
	<div class="hero__orb hero__orb--a" aria-hidden="true"></div>
	<div class="container">
		<img class="hero__logo reveal" src="gallery/logo-wide.svg" alt="Click With Confidence" width="1158" height="193" />
	</div>
</section>

<?php cwc_page_end();
