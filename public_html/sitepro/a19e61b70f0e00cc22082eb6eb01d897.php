<?php
// Home — route: /
require_once dirname(__FILE__) . '/cwc.inc.php';
cwc_page_start(array(
	'title'       => 'Click With Confidence',
	'description' => 'Helping senior citizens identify, avoid, and report scams.',
	'route'       => '',
	'active'      => 'home',
	'bodyClass'   => 'page-home',
));
?>

<section class="hero band">
	<canvas class="particles" aria-hidden="true"></canvas>
	<div class="container hero__layout">
		<h1 class="hero__title reveal">OUR MISSION</h1>
		<figure class="hero__media reveal" data-delay="1">
			<div class="hero__frame" data-parallax="-0.06" data-parallax-max="14">
				<img src="gallery/392ca83b3ff28121175d36650fe0284a.jpg?ts=1789585349" alt="Click With Confidence students in front of a Lottery/Sweepstake Scams presentation slide" width="1280" height="689" />
			</div>
		</figure>
		<p class="hero__text reveal" data-delay="1">Click with Confidence empowers senior citizens to recognize, avoid, and report scams while fostering meaningful intergenerational connections. By equipping middle and high school students to serve as digital mentors, we build safer online experiences and stronger communities where knowledge and care flow both ways.</p>
	</div>
</section>

<section class="section about">
	<div class="container about__grid">
		<div class="about__item reveal">
			<h2 class="h2">Our Vision</h2>
			<p>We envision a world where seniors navigate technology with confidence and security, and young people lead with empathy and service. Through collaboration across generations, Click with Confidence creates a culture of trust, resilience, and shared responsibility in the digital age.</p>
		</div>
		<div class="about__item reveal" data-delay="1">
			<h2 class="h2">Who We Are</h2>
			<p>We are a student-led organization founded by Viraj Shah. He has been running Click With Confidence in some form since 2022, but since 2025, Click With Confidence has involved other students in the Triangle Area.</p>
		</div>
	</div>
</section>

<section class="section section--tint press">
	<div class="container">
		<p class="label press__label">As seen on</p>
		<ul class="press__logos" role="list">
			<li class="press__item reveal">
				<img src="gallery_gen/1fafebf706c0248f29fde4fda1eb63f8_1772x1022_fit.png?ts=1789585350" alt="BBB Spark Jr Awards 2026 Winner" width="1772" height="1022" loading="lazy" />
			</li>
			<li class="press__item press__item--ncidea reveal" data-delay="1"><img src="gallery/partners/ncidea.svg" alt="NC IDEA" width="393" height="170" loading="lazy" /></li>
				<li class="press__item press__item--wral reveal" data-delay="2">
				<img src="gallery/WRAL-TV_1993.svg?ts=1789585350" alt="WRAL" width="240" height="387" loading="lazy" />
			</li>
		</ul>
	</div>
</section>

<section class="section partners" aria-label="Organizations we have collaborated with">
	<div class="container">
		<p class="label partners__label">Collaborated with</p>
	</div>
	<div class="marquee">
		<ul class="marquee__track" role="list">
			<?php
			$partners = array(
				array('bbb.svg', 'Better Business Bureau', 186, 117),
				array('overture-cary.svg', 'Overture Cary', 217, 62),
				array('acclaim-cary-pointe.svg', 'Acclaim Cary Active Living', 387, 125),
				array('raleigh.svg', 'City of Raleigh', 219, 90),
				array('wake-county.svg', 'Wake County', 785, 928),
				array('rlc.webp', 'RLC Resort Lifestyle Communities', 2000, 1000, 'Brier Pointe'),
			);
			// The list is written twice so the loop is seamless; the copy is hidden from screen readers.
			for ($pass = 0; $pass < 2; $pass++) {
				foreach ($partners as $p) {
					echo '<li class="marquee__item"' . ($pass ? ' aria-hidden="true"' : '') . '><img src="gallery/partners/' . $p[0] . '" alt="' . ($pass ? '' : $p[1]) . '" width="' . $p[2] . '" height="' . $p[3] . '" loading="lazy" />' . (isset($p[4]) ? '<span class="marquee__caption">' . $p[4] . '</span>' : '') . '</li>' . "\n";
				}
			}
			?>
		</ul>
	</div>
</section>

<section class="section donate">
	<div class="container">
		<div class="donate-panel reveal">
			<div class="donate-panel__copy">
				<h2 class="h2">Donate</h2>
				<p>Donate to support our mission to help seniors identify, avoid, and report scams. Your donation will help create brochures, printed materials, maintain our website and software, and cover our administrative costs. Your donation will be processed through GiveButter.</p>
			</div>
			<div class="donate-panel__action">
				<a class="btn btn--light btn--lg" href="https://givebutter.com/click-with-confidence"><?php echo cwc_icon('card'); ?><span>Donate Now!</span></a>
			</div>
		</div>
	</div>
</section>

<?php cwc_page_end(array('active' => 'home'));
