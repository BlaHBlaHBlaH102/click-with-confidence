<?php
// Founder's Story — route: /Founders-Story
require_once dirname(__FILE__) . '/cwc.inc.php';
cwc_page_start(array(
	'title'       => 'Founder\'s Story',
	'description' => 'Founder\'s Story',
	'route'       => 'Founders-Story',
	'active'      => 'founders',
	'bodyClass'   => 'page-founders',
));
?>

<article class="story">
	<header class="page-hero page-hero--story">
		<canvas class="particles" aria-hidden="true"></canvas>
		<div class="hero__orb hero__orb--a" aria-hidden="true"></div>
		<div class="hero__orb hero__orb--b" aria-hidden="true"></div>
		<div class="container">
			<img class="story__shield" src="gallery/logo-shield.svg" alt="" width="120" height="120" data-parallax="-0.18" />
			<h1 class="story__title reveal"><strong>Founder's Story <em>by Viraj Shah</em></strong></h1>
		</div>
	</header>

	<div class="section story__section">
		<div class="container container--narrow story__body">
			<div class="story__spine" aria-hidden="true"><span></span></div>

			<div class="story__beat reveal">
				<p>I was inspired to start Click With Confidence when something horrible happened to my grandfather. I remember how excited he was, showing off his new business, NAM Accounting. As soon has he founded NAM Accounting, the business took off - he was overjoyed by his newfound success. He took great pride in his work, and ensured everthing was being done honestly and diligently. <em class="story__turn">Then came the time where a dishonest man decided to ruin a honest man's life. </em></p>
			</div>

			<div class="story__beat reveal">
				<p>A scammer, disguised as a representative of Intuit Quickbooks (the software that my grandfather used for backend financing), sent my grandfather a phishing email. Not knowing any better, my grandfather clicked on the link and watched in horror as his entire bank account was drained. </p>
			</div>

			<div class="story__beat story__beat--stark reveal">
				<p>He had to file bankruptcy the next morning. </p>
			</div>

			<div class="story__beat reveal">
				<p>When this happened, I took it upon myself to make sure that this would never happen again. Starting with my grandfather, who then recommended it to his friends, I was encouraged to deliver presentations teaching senior citizens about scams at centers across the Triangle area. I've been at it since 2022, and now in 2025, I'm happy to announce that I've expanded Click With Confidence to a student organization.</p>
			</div>

			<div class="story__beat reveal">
				<p>Now, other students like me, who are passionate about Click With Confidence's cause, are able to make a real difference in their communities. I've seen first hand how much of an impact Click With Confidence makes - and now, we're taking it to the next level. With social media posts, more senior centers, printed kits, and even and app, seniors all around the world can access our resources, and learn to avoid scams. </p>
			</div>

			<div class="story__beat story__beat--rally reveal">
				<p>It's time to put an end to all of these scams and frauds. It's time to show people that seniors can't be scammed anymore. It's time to fight back, by clicking with confidence. </p>
			</div>

			<div class="story__signoff reveal">
				<p>Thank you so much,</p>
				<p class="story__signature">Viraj Shah</p>
				<p class="story__date"><em>10/22/2025</em></p>
			</div>
		</div>
	</div>
</article>

<?php cwc_page_end(array('active' => 'founders'));
