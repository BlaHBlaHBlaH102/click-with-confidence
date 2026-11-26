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

<section class="intro" aria-label="Click With Confidence">
	<canvas class="intro__canvas" aria-hidden="true"></canvas>
	<img class="intro__logo logo-light" src="gallery/logo-wide.svg" alt="Click With Confidence" width="432" height="72" />
	<img class="intro__logo logo-dark" src="gallery/logo-wide-dark.svg" alt="" width="432" height="72" />
	<button type="button" class="intro__pause" aria-label="Pause animation" aria-pressed="false" data-intro-pause>
		<svg class="intro__pause-icon intro__pause-icon--pause" viewBox="0 0 24 24" aria-hidden="true"><rect x="6" y="5" width="4" height="14" rx="1"/><rect x="14" y="5" width="4" height="14" rx="1"/></svg>
		<svg class="intro__pause-icon intro__pause-icon--play" viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5.5v13a1 1 0 0 0 1.5.86l10.5-6.5a1 1 0 0 0 0-1.72L9.5 4.64A1 1 0 0 0 8 5.5z"/></svg>
	</button>
	<button type="button" class="intro__replay" aria-label="Replay animation" data-intro-replay>
		<svg class="intro__pause-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5V2L7 6l5 4V7a5 5 0 1 1-5 5H5a7 7 0 1 0 7-7z"/></svg>
	</button>
</section>

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

<section class="section game" id="scam-stopper" aria-labelledby="game-title">
	<div class="container">
		<div class="game-card reveal" data-game>
			<p class="label game__label">Daily game</p>
			<h2 class="game__title" id="game-title">Scam Stopper</h2>
			<p class="game__lede">A new scam message every day. Can you find every red flag hiding in it?</p>
			<div class="game__body"></div>
			<noscript><p>Turn on JavaScript to play today's Scam Stopper game.</p></noscript>
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
				array('dhs.svg', 'U.S. Department of Homeland Security', 247, 247),
				array('doj.svg', 'U.S. Department of Justice', 720, 720),
				array('elder-fraud-hotline.png', 'National Elder Fraud Hotline, 1-833-FRAUD-11', 2310, 1537),
			);
			// The list is repeated so one copy spans very wide screens; copies are hidden from screen readers.
			for ($pass = 0; $pass < 6; $pass++) {
				foreach ($partners as $p) {
					echo '<li class="marquee__item"' . ($pass ? ' aria-hidden="true"' : '') . '><img src="gallery/partners/' . $p[0] . '" alt="' . ($pass ? '' : $p[1]) . '" width="' . $p[2] . '" height="' . $p[3] . '" />' . (isset($p[4]) ? '<span class="marquee__caption">' . $p[4] . '</span>' : '') . '</li>' . "\n";
				}
			}
			?>
		</ul>
	</div>
</section>

<section class="section contact" id="contact" aria-labelledby="contact-title">
	<div class="container contact__layout">
		<div class="contact__intro reveal">
			<p class="label">Bring us to you</p>
			<h2 class="contact__title" id="contact-title">Contact us to bring us to your senior center or organization</h2>
			<p class="contact__lede">Tell us a little about your community and we will get back to you to plan a visit.</p>
			<p class="contact__direct">Prefer email? Write to <a href="mailto:info@clickwithconfidence.org">info@clickwithconfidence.org</a>.</p>
		</div>

		<div class="contact__card reveal" data-delay="1">
			<form class="contact-form" action="Contact" method="post" data-contact-form novalidate>
				<div class="contact-form__grid">
					<div class="field">
						<label for="cf-name">Your name <span class="field__req">(required)</span></label>
						<input id="cf-name" name="name" type="text" autocomplete="name" maxlength="100" required />
					</div>
					<div class="field">
						<label for="cf-email">Email <span class="field__req">(required)</span></label>
						<input id="cf-email" name="email" type="email" autocomplete="email" maxlength="150" required />
					</div>
					<div class="field field--wide">
						<label for="cf-org">Senior center or organization <span class="field__req">(required)</span></label>
						<input id="cf-org" name="org" type="text" autocomplete="organization" maxlength="150" required />
					</div>
					<div class="field">
						<label for="cf-type">Type of organization</label>
						<select id="cf-type" name="type">
							<option value="">Choose one</option>
							<option>Senior center</option>
							<option>Library</option>
							<option>Assisted or independent living</option>
							<option>Faith community</option>
							<option>Community organization</option>
							<option>School or student group</option>
							<option>Other</option>
						</select>
					</div>
					<div class="field">
						<label for="cf-city">City or town</label>
						<input id="cf-city" name="city" type="text" autocomplete="address-level2" maxlength="100" />
					</div>
					<div class="field">
						<label for="cf-phone">Phone</label>
						<input id="cf-phone" name="phone" type="tel" autocomplete="tel" maxlength="40" />
					</div>
					<div class="field">
						<label for="cf-people">About how many people?</label>
						<input id="cf-people" name="people" type="text" inputmode="numeric" maxlength="40" />
					</div>
					<div class="field field--wide">
						<label for="cf-when">When would you like us to visit?</label>
						<input id="cf-when" name="when" type="text" maxlength="100" placeholder="For example: a weekday morning in March" />
					</div>
					<div class="field field--wide">
						<label for="cf-message">Anything else we should know?</label>
						<textarea id="cf-message" name="message" rows="4" maxlength="3000"></textarea>
					</div>
				</div>

				<div class="contact-form__trap" aria-hidden="true">
					<label for="cf-website">Leave this field empty</label>
					<input id="cf-website" name="website" type="text" tabindex="-1" autocomplete="off" />
				</div>
				<input type="hidden" name="ts" value="<?php echo time(); ?>" />

				<p class="contact-form__status" role="status" aria-live="polite" data-contact-status></p>
				<button class="btn btn--primary btn--lg" type="submit"><span>Send request</span></button>
			</form>
			<div class="contact-done" data-contact-done hidden tabindex="-1">
				<h3 class="contact-done__title">Thank you!</h3>
				<p>Your request was sent to our team. We will reply by email soon.</p>
			</div>
		</div>
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

<script defer src="<?php echo cwc_asset('js/scam-stopper-data.js'); ?>"></script>
<script defer src="<?php echo cwc_asset('js/scam-stopper.js'); ?>"></script>
<script defer src="<?php echo cwc_asset('js/contact-form.js'); ?>"></script>

<?php cwc_page_end(array('active' => 'home'));
