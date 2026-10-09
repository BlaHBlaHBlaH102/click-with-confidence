<?php
// App — route: /App (reachable directly; intentionally not in the main menu)
require_once dirname(__FILE__) . '/cwc.inc.php';
cwc_page_start(array(
	'title'       => 'App',
	'description' => 'App',
	'route'       => 'App',
	'active'      => '',
	'bodyClass'   => 'page-app',
));

// App screenshots, in the original gallery's order (thumbnail + full-size image).
$cwcScreens = array(
	array('gallery_gen/50044e19a29075b04e46133a2e8211ee_600x404_fill.jpg',  'gallery_gen/53ac10d01581149d1bb0409e2ac6fb71_fit.jpg?ts=1789585351', 1320, 890),
	array('gallery_gen/fd240cda686f806472038fd651924f0b_600x760_fill.jpg',  'gallery_gen/f97733a26ae474e09cc440345ebeab5b_fit.jpg?ts=1789585351', 1320, 1672),
	array('gallery_gen/2faa1608fc1e691ab2370bdaa434b39b_600x314_fill.jpg',  'gallery_gen/ba3c62d1d0627b18389d2e6b1598f0cd_fit.jpg?ts=1789585351', 1320, 689),
	array('gallery_gen/c6e03edb50782528a063db2a19c4ef66_600x1236_fill.jpg', 'gallery_gen/e6b83df75b5278869e5894c27f8f8a53_fit.jpg?ts=1789585351', 1320, 2720),
	array('gallery_gen/452c9d084fe5eb434c0b1c6ff506d94f_600x980_fill.jpg',  'gallery_gen/900e81f4983e7423910aae6cdb9e5488_fit.jpg?ts=1789585351', 1320, 2158),
	array('gallery_gen/d79ca34b69a26477a1dc62b24ba1cb2f_600x986_fill.jpg',  'gallery_gen/a788c208ef2109bd2f537d0d5889b9fd_fit.jpg?ts=1789585352', 1320, 2171),
	array('gallery_gen/a4db170d0f17c5d9ed190ef9702a118d_600x756_fill.jpg',  'gallery_gen/bb08b767e7ae2a658e533ebcc5f61847_fit.jpg?ts=1789585352', 1320, 1664),
	array('gallery_gen/fc58b3c3a92284b6045f5bf62738db5a_600x704_fill.jpg',  'gallery_gen/3ca57c6b711ae27e135d56948872f8b4_fit.jpg?ts=1789585352', 1320, 1547),
	array('gallery_gen/7635980455156b6affa83a6abe0b931c_600x850_fill.jpg',  'gallery_gen/3045e4ab4b80f2fac33c602a10e7ee2a_fit.jpg?ts=1789585352', 1320, 1871),
	array('gallery_gen/fff5805814fda0369ee5190987d1e5c3_600x776_fill.jpg',  'gallery_gen/3b5f603d516c2dd38b8d1b1b38efb696_fit.jpg?ts=1789585352', 1320, 1707),
	array('gallery_gen/348e2433a1162c77399f2347185a032d_600x1220_fill.jpg', 'gallery_gen/2905830c3dd17b87046575fce66b6532_fit.jpg?ts=1789585352', 1320, 2682),
	array('gallery_gen/a0c0ee2ac77c7cab525704bccc431b0b_600x1248_fill.jpg', 'gallery_gen/e00486cc8fc65d4613944ce41069f7c1_fit.jpg?ts=1789585352', 1320, 2746),
);
?>

<section class="page-band band">
	<canvas class="particles" aria-hidden="true"></canvas>
	<div class="container">
		<h1 class="page-band__title reveal">OUR APP</h1>
	</div>
</section>

<section class="section">
	<div class="container">
		<p class="lede app-intro reveal">The Click With Confidence Mobile Application allows senior citizens to use AI in order to identify whether a call, text, or email is suspicious or not. Seniors can also reach out to real volunteers, who can identify requests and help seniors on their own time. <span class="badge-soon">LAUNCHING SOON!</span></p>

		<ul class="masonry" role="list" data-lightbox>
			<?php foreach ($cwcScreens as $i => $s): ?>
			<li class="masonry__item reveal" data-delay="<?php echo $i % 3; ?>">
				<a class="masonry__link" href="<?php echo $s[1]; ?>" data-full-w="<?php echo $s[2]; ?>" data-full-h="<?php echo $s[3]; ?>">
					<img src="<?php echo $s[0]; ?>" alt="Click With Confidence app screenshot <?php echo $i + 1; ?>" width="600" height="<?php echo (int) round(600 * $s[3] / $s[2]); ?>" loading="lazy" />
				</a>
			</li>
			<?php endforeach; ?>
		</ul>
	</div>
</section>

<?php cwc_page_end();
