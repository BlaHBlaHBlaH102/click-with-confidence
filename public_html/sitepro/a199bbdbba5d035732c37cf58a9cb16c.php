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

<section class="section">
	<div class="container">
		<img class="maintenance-logo" src="gallery/logo-wide.svg" alt="Click With Confidence" width="432" height="72" />
	</div>
</section>

<?php cwc_page_end();
