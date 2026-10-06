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

<section class="hero hero--home">
	<canvas class="particles" aria-hidden="true"></canvas>
	<div class="hero__orb hero__orb--a" aria-hidden="true"></div>
	<div class="hero__orb hero__orb--b" aria-hidden="true"></div>
	<div class="hero__grid" aria-hidden="true"></div>
	<div class="container hero__inner">
		<img class="hero__logo reveal" src="gallery/logo-wide.svg" alt="Click With Confidence" width="1158" height="193" />
		<h1 class="display hero__title reveal" data-delay="2"><span class="hero__title-text">OUR MISSION</span></h1>
		<span class="hero__cue" aria-hidden="true"><span></span></span>
	</div>
</section>

<section class="section mission" id="mission">
	<div class="container">
		<figure class="mission__media" data-scale-in>
			<img src="gallery/392ca83b3ff28121175d36650fe0284a.jpg?ts=1789585349" alt="Click With Confidence students in front of a Lottery/Sweepstake Scams presentation slide" width="1280" height="689" loading="lazy" data-parallax="0.08" data-parallax-max="26" />
		</figure>
		<p class="lede mission__text" data-words>Click with Confidence empowers senior citizens to recognize, avoid, and report scams while fostering meaningful intergenerational connections. By equipping middle and high school students to serve as digital mentors, we build safer online experiences and stronger communities where knowledge and care flow both ways.</p>
	</div>
</section>

<section class="section section--tint about">
	<div class="container about__grid">
		<article class="feature-card reveal">
			<span class="feature-card__icon"><?php echo cwc_icon('eye'); ?></span>
			<h2 class="section-title">Our Vision</h2>
			<p>We envision a world where seniors navigate technology with confidence and security, and young people lead with empathy and service. Through collaboration across generations, Click with Confidence creates a culture of trust, resilience, and shared responsibility in the digital age.</p>
		</article>
		<article class="feature-card reveal" data-delay="1">
			<span class="feature-card__icon"><?php echo cwc_icon('people'); ?></span>
			<h2 class="section-title">Who We Are</h2>
			<p>We are a student-led organization founded by Viraj Shah. He has been running Click With Confidence in some form since 2022, but since 2025, Click With Confidence has involved other students in the Triangle Area.</p>
		</article>
	</div>
</section>

<section class="section press">
	<div class="container">
		<p class="eyebrow press__label reveal">As seen on</p>
		<ul class="press__logos" role="list">
			<li class="press__item reveal" data-delay="1">
				<img src="gallery_gen/1fafebf706c0248f29fde4fda1eb63f8_1772x1022_fit.png?ts=1789585350" alt="BBB Spark Jr Awards 2026 Winner" width="1772" height="1022" loading="lazy" />
			</li>
			<li class="press__item press__item--wral reveal" data-delay="2">
				<img src="gallery/WRAL-TV_1993.svg?ts=1789585350" alt="WRAL" width="240" height="387" loading="lazy" />
			</li>
		</ul>
	</div>
</section>

<section class="section donate" id="donate">
	<div class="container">
		<div class="donate-card reveal">
			<canvas class="particles particles--light" aria-hidden="true"></canvas>
			<span class="donate-card__icon" aria-hidden="true"><?php echo cwc_icon('heart'); ?></span>
			<h2 class="section-title donate-card__title">Donate</h2>
			<p class="donate-card__text">Donate to support our mission to help seniors identify, avoid, and report scams. Your donation will help create brochures, printed materials, maintain our website and software, and cover our administrative costs. Your donation will be processed through GiveButter.</p>
			<a class="btn btn--light btn--lg" href="https://givebutter.com/click-with-confidence"><?php echo cwc_icon('card'); ?><span>Donate Now!</span></a>
		</div>
	</div>
</section>

<?php cwc_page_end(array('active' => 'home'));
