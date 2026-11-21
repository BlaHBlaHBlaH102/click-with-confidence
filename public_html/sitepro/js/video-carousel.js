/*
 * Click With Confidence — video carousel (Video Content page).
 *
 * A scroll-snap track, so touch swiping and trackpads work natively. This script adds
 * the arrow buttons, the dots, keyboard arrows, and "only one video plays at a time".
 * When every video fits on screen the arrows and dots are hidden.
 */
(function () {
	'use strict';

	var root = document.querySelector('[data-vcar]');
	if (!root) { return; }

	var track = root.querySelector('[data-vcar-track]');
	var prev = root.querySelector('[data-vcar-prev]');
	var next = root.querySelector('[data-vcar-next]');
	var dotsBox = root.querySelector('[data-vcar-dots]');
	var slides = Array.prototype.slice.call(track.children);
	var dots = Array.prototype.slice.call(dotsBox.children);
	var videos = Array.prototype.slice.call(track.querySelectorAll('video'));
	var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
	var ticking = false;

	function behavior() { return reduce ? 'auto' : 'smooth'; }

	/* The slide closest to the middle of the visible track. */
	function current() {
		var mid = track.scrollLeft + track.clientWidth / 2;
		var best = 0, bestDist = Infinity;
		slides.forEach(function (s, i) {
			var d = Math.abs(s.offsetLeft + s.offsetWidth / 2 - mid);
			if (d < bestDist) { bestDist = d; best = i; }
		});
		return best;
	}

	function goTo(i) {
		i = Math.max(0, Math.min(slides.length - 1, i));
		var s = slides[i];
		track.scrollTo({ left: s.offsetLeft - (track.clientWidth - s.offsetWidth) / 2, behavior: behavior() });
	}

	function update() {
		ticking = false;
		var overflow = track.scrollWidth > track.clientWidth + 2;
		prev.hidden = next.hidden = dotsBox.hidden = !overflow;
		var c = current();
		prev.disabled = track.scrollLeft <= 2;
		next.disabled = track.scrollLeft >= track.scrollWidth - track.clientWidth - 2;
		videos.forEach(function (v, i) { if (i !== c && !v.paused) { v.pause(); } });
		dots.forEach(function (d, i) {
			if (i === c) { d.setAttribute('aria-current', 'true'); } else { d.removeAttribute('aria-current'); }
		});
	}

	function queue() {
		if (!ticking) { ticking = true; window.requestAnimationFrame(update); }
	}

	prev.addEventListener('click', function () { goTo(current() - 1); });
	next.addEventListener('click', function () { goTo(current() + 1); });
	dots.forEach(function (d, i) { d.addEventListener('click', function () { goTo(i); }); });
	track.addEventListener('scroll', queue, { passive: true });
	window.addEventListener('resize', queue);

	/* Left/right arrows move between videos unless a video control has focus. */
	root.addEventListener('keydown', function (e) {
		if (e.target && e.target.tagName === 'VIDEO') { return; }
		if (e.key === 'ArrowLeft') { goTo(current() - 1); e.preventDefault(); }
		if (e.key === 'ArrowRight') { goTo(current() + 1); e.preventDefault(); }
	});

	/* One video at a time. */
	videos.forEach(function (v) {
		v.addEventListener('play', function () {
			videos.forEach(function (o) { if (o !== v) { o.pause(); } });
		});
	});

	update();
	window.addEventListener('load', update);
})();
