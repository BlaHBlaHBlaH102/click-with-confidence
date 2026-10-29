<?php
// Impact — route: /impact
require_once dirname(__FILE__) . '/cwc.inc.php';
cwc_page_start(array(
	'title'       => 'Click With Confidence - Impact',
	'description' => 'Click With Confidence - Impact',
	'route'       => 'impact',
	'active'      => 'impact',
	'bodyClass'   => 'page-impact',
));
?>

<section class="page-band band">
	<canvas class="particles" aria-hidden="true"></canvas>
	<div class="container">
		<h1 class="page-band__title reveal">Impact</h1>
	</div>
</section>

<section class="section">
	<div class="container">
		<?php
		// "We stop scams." one letter per span, coloured along the logo's three blues (light to dark).
		$stops = array(array(92, 163, 255), array(31, 128, 255), array(0, 74, 173));
		$words = array('we', 'stop', 'scams');
		$total = 0;
		foreach ($words as $w) { $total += strlen($w); }
		$n = 0;
		?>
		<h2 class="impact-headline reveal" aria-label="we stop scams">
			<span aria-hidden="true"><?php foreach ($words as $wi => $w): ?><?php if ($wi !== 1) { echo '<span class="impact-headline__line">'; } ?><span class="impact-headline__word"><?php
				for ($j = 0; $j < strlen($w); $j++) {
					$f = $n / max(1, $total - 1) * 2;
					$a = $stops[(int) min(1, floor($f))];
					$b = $stops[(int) min(2, floor($f) + 1)];
					$k = $f - min(1, floor($f));
					$col = sprintf('#%02X%02X%02X', round($a[0] + ($b[0] - $a[0]) * $k), round($a[1] + ($b[1] - $a[1]) * $k), round($a[2] + ($b[2] - $a[2]) * $k));
					echo '<span class="impact-headline__ch' . ($wi === 0 && $j === 0 ? ' impact-headline__ch--tight' : '') . '" style="--i:' . $n . ';--c:' . $col . '">' . htmlspecialchars($w[$j]) . '</span>';
					$n++;
				}
			?></span><?php if ($wi === 0) { echo ' '; } else { echo '</span>'; } ?><?php endforeach; ?></span>
		</h2>

		<div class="stats">
			<div class="stat reveal">
				<h2 class="stat__text"><span class="stat__num" data-count="2500">2,500+</span> seniors</h2>
			</div>
			<div class="stat reveal" data-delay="1">
				<h2 class="stat__text"><span class="stat__num" data-count="50">50+</span> presentations</h2>
			</div>
			<div class="stat reveal" data-delay="2">
				<h2 class="stat__text"><span class="stat__num" data-count="35">35+</span> members</h2>
			</div>
			<div class="stat reveal" data-delay="3">
				<h2 class="stat__text"><span class="stat__num" data-count="13">13</span> leaders</h2>
			</div>
		</div>

		<div class="embed embed--sheet reveal">
			<div style="width: 100%; height: 100%; overflow-y: auto;"><iframe src="https://docs.google.com/spreadsheets/d/e/2PACX-1vShiAu4qHRqwfyqfScfmUcn_KOQOG0EfajoZiFxEo1j1xGfh_8l5iISgGzNZFfCRcU0MgVhWR8SQr3p/pubhtml?widget=true&amp;headers=false" title="Impact" loading="lazy"></iframe></div>
		</div>
	</div>
</section>

<?php cwc_page_end(array('active' => 'impact'));
