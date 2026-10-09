<?php
// Leadership — route: /leadership
require_once dirname(__FILE__) . '/cwc.inc.php';
cwc_page_start(array(
	'title'       => 'Click With Confidence - Leadership',
	'description' => 'Click With Confidence - Leadership',
	'route'       => 'leadership',
	'active'      => 'leadership',
	'bodyClass'   => 'page-leadership',
));

// Team members, in the original slideshow's order (name = picture title, role = picture description).
$cwcTeam = array(
	array('src' => 'gallery_gen/a24eec9668ed5c6c0229b931150028c2_fit.jpg?ts=1789585351', 'w' => 1280, 'h' => 1280, 'name' => 'Viraj Shah',    'role' => 'Founder & President'),
	array('src' => 'gallery_gen/60e1d885d9c2eedb958340a78f11e8d3_fit.jpg?ts=1789585351', 'w' => 1280, 'h' => 1280, 'name' => 'Luke Walsh',    'role' => 'Social Media'),
	array('src' => 'gallery_gen/040921d6c88bbb060781915781c266a3_fit.jpg?ts=1789585351', 'w' => 1280, 'h' => 1280, 'name' => 'Minyul Jung',   'role' => 'Website'),
	array('src' => 'gallery_gen/3b9b2db1691fc5bcb49624f739706b0a_fit.jpg?ts=1789585351', 'w' => 690,  'h' => 876,  'name' => 'Jacob Michael', 'role' => 'Outreach'),
	array('src' => 'gallery_gen/c1934be90874e0f3f318cd1d99c981e4_fit.jpg?ts=1789585351', 'w' => 1005, 'h' => 1618, 'name' => 'Sakhi Thacker', 'role' => 'Business Connections'),
	array('src' => 'gallery_gen/0d55592fa52b3b34a7ccf483a5980288_fit.jpg?ts=1789585351', 'w' => 1198, 'h' => 1597, 'name' => 'Aarna Vaidya',  'role' => 'Outreach'),
);
?>

<section class="page-band band">
	<canvas class="particles" aria-hidden="true"></canvas>
	<div class="container">
		<h1 class="page-band__title reveal">Leadership</h1>
	</div>
</section>

<section class="section">
	<div class="container container--mid">
		<ul class="team" role="list">
			<?php foreach ($cwcTeam as $i => $member): ?>
			<li class="team-card reveal" data-delay="<?php echo $i % 3; ?>">
				<figure>
					<div class="team-card__photo">
						<img src="<?php echo $member['src']; ?>" alt="<?php echo cwc_e($member['name']); ?>" width="<?php echo $member['w']; ?>" height="<?php echo $member['h']; ?>" loading="<?php echo $i < 3 ? 'eager' : 'lazy'; ?>" />
					</div>
					<figcaption class="team-card__caption">
						<span class="team-card__name"><?php echo cwc_e($member['name']); ?></span>
						<span class="team-card__role"><?php echo cwc_e($member['role']); ?></span>
					</figcaption>
				</figure>
			</li>
			<?php endforeach; ?>
		</ul>
	</div>
</section>

<?php cwc_page_end(array('active' => 'leadership'));
