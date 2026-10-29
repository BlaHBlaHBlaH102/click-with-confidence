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
	<header class="page-band band">
		<canvas class="particles" aria-hidden="true"></canvas>
		<div class="container">
			<h1 class="page-band__title story__title reveal"><strong>Founder's Story <em>by Viraj Shah</em></strong></h1>
		</div>
	</header>

	<div class="section">
		<div class="container container--text story__body">
			<div class="story__spine" aria-hidden="true"><span></span></div>

			<div class="story__beat reveal">
				<p>I was inspired to start Click With Confidence when something horrible happened to my grandfather. I remember how excited he was, showing off his new business, NAM Accounting. As soon has he founded NAM Accounting, the business took off - he was overjoyed by his newfound success. He took great pride in his work, and ensured everthing was being done honestly and diligently. <em class="story__turn">Then came the time where a dishonest man decided to ruin a honest man's life. </em></p>
			</div>

			<div class="story__beat reveal">
				<p>A scammer, disguised as a representative of Intuit Quickbooks (the software that my grandfather used for backend financing), sent my grandfather a phishing email. Not knowing any better, my grandfather clicked on the link and watched in horror as his entire bank account was drained. </p>
			</div>

			<div class="story__beat story__beat--stark reveal">
				<p><em class="story__turn">He had to file bankruptcy the next morning. </em></p>
			</div>

			<div class="story__beat reveal">
				<p>When this happened, I took it upon myself to make sure that this would never happen again. Starting with my grandfather, who then recommended it to his friends, I was encouraged to deliver presentations teaching senior citizens about scams at centers across the Triangle area. I've been at it since 2022, and now in 2025, I'm happy to announce that I've expanded Click With Confidence to a student organization.</p>
			</div>

			<div class="story__beat reveal">
				<p>Now, other students like me, who are passionate about Click With Confidence's cause, are able to make a real difference in their communities. I've seen first hand how much of an impact Click With Confidence makes - and now, we're taking it to the next level. With social media posts, more senior centers, printed kits, and even and app, seniors all around the world can access our resources, and learn to avoid scams. </p>
			</div>

			<div class="story__beat story__beat--rally reveal">
				<p><em class="story__turn">It's time to put an end to all of these scams and frauds. It's time to show people that seniors can't be scammed anymore. It's time to fight back, by clicking with confidence. </em></p>
			</div>

			<div class="story__signoff reveal">
				<p>Thank you so much,</p>
				<p class="story__signature">Viraj Shah</p>
				<?php $showSignature = false; // set to true to show the signature that writes itself in on scroll ?>
<?php if ($showSignature): ?>
<svg class="story__autograph" viewBox="0 0 957 501" role="img" aria-label="Viraj Shah&#39;s signature" data-signature>
					<defs>
						<mask id="cwc-signature-mask" maskUnits="userSpaceOnUse" x="0" y="0" width="957" height="501">
							<!-- Pen strokes traced from the signature, in writing order; cwc.js draws them in as the page scrolls. -->
							<g fill="none" stroke="#fff" stroke-width="30" stroke-linecap="round" stroke-linejoin="round" stroke-dasharray="1 1">
							<path d="M19 184L19 184" pathLength="1" data-s="0" data-e="0.0018"/>
							<path d="M19 186L19 180L25 179" pathLength="1" data-s="0.0018" data-e="0.0046"/>
							<path d="M19 186L13 185L16 181L19 181L21 186L19 184L21 185" pathLength="1" data-s="0.0046" data-e="0.0107"/>
							<path d="M21 185L24 183L25 179L29 178L38 167L56 154L62 147L72 141L78 134L80 134L118 96L132 89L135 91L134 135L128 167L127 187L124 196L124 207L118 246L116 250L116 260L113 268L113 277L107 299L102 328L102 338L105 341" pathLength="1" data-s="0.0107" data-e="0.1101"/>
							<path d="M96 377L105 341L116 335L143 291L147 288L156 274L162 269L164 263L174 253L186 236L193 230L202 217L217 201L217 199L299 115L370 51L403 19L404 16" pathLength="1" data-s="0.1101" data-e="0.2427"/>
							<path d="M169 325L173 317L179 312L187 309L190 310L186 337L186 344L188 345" pathLength="1" data-s="0.2427" data-e="0.2584"/>
							<path d="M188 345L199 342L210 324" pathLength="1" data-s="0.2584" data-e="0.2668"/>
							<path d="M191 284L189 281L190 278L201 279" pathLength="1" data-s="0.2668" data-e="0.2711"/>
							<path d="M230 348L230 330L234 307L242 302L246 295L258 282L263 280L266 280L271 288L275 289L279 293" pathLength="1" data-s="0.2711" data-e="0.2969"/>
							<path d="M268 336L266 334L267 324L272 308L289 277" pathLength="1" data-s="0.2969" data-e="0.3138"/>
							<path d="M268 336L279 331L281 326L286 321L290 310L294 306L311 304L326 285L333 282" pathLength="1" data-s="0.3138" data-e="0.3377"/>
							<path d="M297 305L298 292" pathLength="1" data-s="0.3377" data-e="0.3407"/>
							<path d="M305 381L295 386L245 469L243 479L246 483L256 481L267 470L288 433L306 392L307 383L305 380L319 357L329 337L334 322L344 318L377 274L424 224L427 214" pathLength="1" data-s="0.3407" data-e="0.4619"/>
							<path d="M330 219L323 210L322 197L323 193L336 179L378 147L415 123L420 122L429 115L439 111L472 91L482 87L483 85L490 83L495 79L499 79L512 71L552 53L557 53L563 49L607 37L623 38L631 44L629 61L624 66L617 69" pathLength="1" data-s="0.4619" data-e="0.5678"/>
							<path d="M330 219L334 217L378 216L423 212L428 214L442 209L527 208L534 211L550 208L556 212L580 216L585 219L592 219L599 225L610 228L614 233L628 233" pathLength="1" data-s="0.5678" data-e="0.6397"/>
							<path d="M334 322L332 320L332 306L335 285L333 282L333 277L335 269" pathLength="1" data-s="0.6397" data-e="0.6524"/>
							<path d="M442 209L444 201L447 197" pathLength="1" data-s="0.6524" data-e="0.6555"/>
							<path d="M532 211L528 220L512 229L469 261L465 262L456 270L444 276L429 287L401 316L399 327L402 332L426 333L472 324L536 304L578 283L583 283L586 280L586 276L590 267L592 266L595 256L606 253L611 244L627 244" pathLength="1" data-s="0.6555" data-e="0.7693"/>
							<path d="M550 208L553 201L564 193L570 191L600 170L611 168" pathLength="1" data-s="0.7693" data-e="0.7886"/>
							<path d="M595 256L590 251L591 238L594 225L599 219L599 213L610 181L611 168L615 164L620 152L624 122L627 118L629 102" pathLength="1" data-s="0.7886" data-e="0.8285"/>
							<path d="M612 244L613 231" pathLength="1" data-s="0.8285" data-e="0.8315"/>
							<path d="M613 231L618 227L627 224L629 225L626 252L627 258L632 261L643 257L650 249L662 245" pathLength="1" data-s="0.8315" data-e="0.8547"/>
							<path d="M619 155L633 152L670 132" pathLength="1" data-s="0.8547" data-e="0.8692"/>
							<path d="M672 225L662 245L663 254L665 256L676 252L700 227L705 227L711 231L721 233" pathLength="1" data-s="0.8692" data-e="0.8953"/>
							<path d="M749 119L746 150L741 168L739 186L726 228L720 236L718 249L718 259L720 261L731 258L748 240L748 238L764 220L766 215L778 204L784 204L786 206L788 220L792 226L800 230L816 230L828 228L835 224L846 223L876 214L881 214L882 212L898 208L905 204L930 196L941 195" pathLength="1" data-s="0.8953" data-e="0.9985"/>
							<path d="M883 218L883 218" pathLength="1" data-s="0.9985" data-e="1"/>
							</g>
						</mask>
					</defs>
					<image href="gallery/signature-ink.png" width="957" height="501"/>
				</svg>
<?php endif; ?>
				<p class="story__date"><em>10/22/2025</em></p>
			</div>
		</div>
	</div>
</article>

<?php cwc_page_end(array('active' => 'founders'));
