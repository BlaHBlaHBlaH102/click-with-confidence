/*
 * Click With Confidence — site behaviour.
 *
 * Display modes: html[data-mode] is "industry" (Interactive) or "readable".
 * Everything decorative here (particles, parallax, reveals, counters, tilt)
 * runs only in Interactive mode and stays still when the visitor's system
 * asks for reduced motion. Readable mode shows all content immediately.
 */
(function () {
	'use strict';

	var html = document.documentElement;
	var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

	function $(sel, ctx) { return (ctx || document).querySelector(sel); }
	function $$(sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); }
	function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }
	function isInteractive() { return html.getAttribute('data-mode') !== 'readable'; }
	function store(key, value) { try { localStorage.setItem(key, value); } catch (e) {} }

	window.__cwcReady = true;

	/* ------------------------------------------------------------------ */
	/* Display mode + text size                                            */
	/* ------------------------------------------------------------------ */

	function syncModeControls() {
		var mode = isInteractive() ? 'industry' : 'readable';
		$$('[data-mode-set]').forEach(function (b) {
			b.setAttribute('aria-pressed', String(b.getAttribute('data-mode-set') === mode));
		});
		$$('[data-mode-toggle]').forEach(function (b) {
			b.setAttribute('aria-checked', String(mode === 'readable'));
		});
		var size = html.getAttribute('data-text') || '1';
		$$('[data-text-set]').forEach(function (b) {
			b.setAttribute('aria-pressed', String(b.getAttribute('data-text-set') === size));
		});
	}

	function setMode(mode) {
		mode = mode === 'readable' ? 'readable' : 'industry';
		if (html.getAttribute('data-mode') === mode) { return; }
		var apply = function () {
			html.setAttribute('data-mode', mode);
			store('cwc-mode', mode);
			closeNav();
			syncModeControls();
			onModeChange();
		};
		if (document.startViewTransition && !reduceMotion && !document.hidden) {
			// A skipped transition still applies the change; it just isn't animated.
			var transition = document.startViewTransition(apply);
			var ignore = function () {};
			transition.ready.catch(ignore);
			transition.finished.catch(ignore);
			transition.updateCallbackDone.catch(ignore);
		} else {
			apply();
		}
	}

	document.addEventListener('click', function (e) {
		var setBtn = e.target.closest('[data-mode-set]');
		if (setBtn) { setMode(setBtn.getAttribute('data-mode-set')); return; }
		var toggle = e.target.closest('[data-mode-toggle]');
		if (toggle) { setMode(isInteractive() ? 'readable' : 'industry'); return; }
		var sizeBtn = e.target.closest('[data-text-set]');
		if (sizeBtn) {
			var size = sizeBtn.getAttribute('data-text-set');
			html.setAttribute('data-text', size);
			store('cwc-text', size);
			syncModeControls();
		}
	});

	/* ------------------------------------------------------------------ */
	/* Header: menu, scrolled state, progress                              */
	/* ------------------------------------------------------------------ */

	var header = $('.site-header');
	var navToggle = $('.nav-toggle');

	function measureHeader() {
		if (!header) { return; }
		var h = header.offsetHeight;
		html.style.setProperty('--header-h', h + 'px');
		html.style.setProperty('--nav-top', Math.max(0, header.getBoundingClientRect().bottom) + 'px');
	}

	// While the full-screen menu is open, the page behind it can't be reached with Tab.
	function setBackgroundInert(on) {
		$$('.announce, .site-main, .site-footer, .cookie-notice').forEach(function (el) {
			if (on) { el.setAttribute('inert', ''); } else { el.removeAttribute('inert'); }
		});
	}

	function closeNav() {
		if (!html.classList.contains('nav-open')) { return; }
		html.classList.remove('nav-open');
		setBackgroundInert(false);
		if (navToggle) {
			navToggle.setAttribute('aria-expanded', 'false');
			navToggle.setAttribute('aria-label', 'Open menu');
		}
	}

	if (navToggle) {
		navToggle.addEventListener('click', function () {
			var open = !html.classList.contains('nav-open');
			measureHeader();
			html.classList.toggle('nav-open', open);
			setBackgroundInert(open);
			navToggle.setAttribute('aria-expanded', String(open));
			navToggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
			if (open) {
				var first = $('.site-nav__link');
				if (first) { setTimeout(function () { first.focus({ preventScroll: true }); }, 50); }
			}
		});
	}
	document.addEventListener('keydown', function (e) {
		if (e.key === 'Escape' && html.classList.contains('nav-open')) {
			closeNav();
			if (navToggle) { navToggle.focus(); }
		}
	});
	$$('.site-nav__link').forEach(function (a) { a.addEventListener('click', closeNav); });

	/* ------------------------------------------------------------------ */
	/* Scroll reveals                                                      */
	/* ------------------------------------------------------------------ */

	var revealObserver = null;
	if ('IntersectionObserver' in window) {
		revealObserver = new IntersectionObserver(function (entries) {
			entries.forEach(function (entry) {
				if (entry.isIntersecting) {
					entry.target.classList.add('is-in');
					revealObserver.unobserve(entry.target);
				}
			});
		}, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
		$$('.reveal').forEach(function (el) { revealObserver.observe(el); });
	} else {
		$$('.reveal').forEach(function (el) { el.classList.add('is-in'); });
	}

	/* ------------------------------------------------------------------ */
	/* Scroll-linked effects: parallax, scale-in, words, story spine        */
	/* ------------------------------------------------------------------ */

	var parallaxEls = $$('[data-parallax]');
	var storyBody = $('.story__body');
	var storySpine = $('.story__spine');
	var ticking = false;

	function onScroll() {
		if (!ticking) {
			ticking = true;
			requestAnimationFrame(updateScroll);
		}
	}

	function updateScroll() {
		ticking = false;
		var vh = window.innerHeight;
		var y = window.pageYOffset || document.documentElement.scrollTop;

		if (header) { header.classList.toggle('is-scrolled', y > 8); }

		if (!isInteractive() || reduceMotion) { return; }

		parallaxEls.forEach(function (el) {
			var speed = parseFloat(el.getAttribute('data-parallax')) || 0;
			var r = el.getBoundingClientRect();
			if (r.bottom < -200 || r.top > vh + 200) { return; }
			var offset = (r.top + r.height / 2 - vh / 2) * speed;
			var max = parseFloat(el.getAttribute('data-parallax-max'));
			if (max) { offset = clamp(offset, -max, max); }
			el.style.setProperty('--parallax', offset.toFixed(1) + 'px');
		});

		if (storyBody && storySpine) {
			var sr = storyBody.getBoundingClientRect();
			var sp = clamp((vh * 0.6 - sr.top) / sr.height, 0, 1);
			storySpine.style.setProperty('--story', sp.toFixed(4));
		}
	}

	function resetScrollEffects() {
		parallaxEls.forEach(function (el) { el.style.removeProperty('--parallax'); });
		if (storySpine) { storySpine.style.setProperty('--story', 1); }
	}

	window.addEventListener('scroll', onScroll, { passive: true });
	window.addEventListener('resize', function () {
		measureHeader();
		if (navToggle && html.classList.contains('nav-open') && getComputedStyle(navToggle).display === 'none') { closeNav(); }
		onScroll();
	});

	/* ------------------------------------------------------------------ */
	/* Counters (end on the exact original text)                           */
	/* ------------------------------------------------------------------ */

	var counters = $$('[data-count]');
	counters.forEach(function (el) { el.setAttribute('data-final', el.textContent); });

	function runCounter(el) {
		var finalText = el.getAttribute('data-final');
		var target = parseInt(el.getAttribute('data-count'), 10);
		var suffix = finalText.replace(/[\d,.\s]/g, '');
		if (!isInteractive() || reduceMotion || !target) { el.textContent = finalText; return; }
		// Screen readers hear the final sentence, not the numbers rolling past.
		var heading = el.closest('h1, h2, h3') || el.parentNode;
		heading.setAttribute('aria-label', heading.textContent.replace(el.textContent, finalText).replace(/\s+/g, ' ').trim());
		var duration = 1800;
		var t0 = null;
		function frame(t) {
			if (t0 === null) { t0 = t; }
			var k = clamp((t - t0) / duration, 0, 1);
			var eased = 1 - Math.pow(1 - k, 4);
			el.textContent = Math.round(target * eased).toLocaleString('en-US') + suffix;
			if (k < 1 && isInteractive()) { requestAnimationFrame(frame); } else { el.textContent = finalText; heading.removeAttribute('aria-label'); }
		}
		requestAnimationFrame(frame);
	}

	if (counters.length && 'IntersectionObserver' in window) {
		var countObserver = new IntersectionObserver(function (entries) {
			entries.forEach(function (entry) {
				if (entry.isIntersecting) {
					runCounter(entry.target);
					countObserver.unobserve(entry.target);
				}
			});
		}, { threshold: 0.3 });
		counters.forEach(function (el) { countObserver.observe(el); });
	}

	/* ------------------------------------------------------------------ */
	/* Particle network                                                    */
	/* ------------------------------------------------------------------ */

	function ParticleField(canvas) {
		this.canvas = canvas;
		this.ctx = canvas.getContext('2d');
		this.points = [];
		this.pointer = { x: -9999, y: -9999 };
		this.visible = false;
		this.running = false;
		this.raf = 0;
		this.w = 0;
		this.h = 0;
		var self = this;
		this.loop = function () { self.frame(); };
		var host = canvas.parentElement;
		host.addEventListener('pointermove', function (e) {
			var r = canvas.getBoundingClientRect();
			self.pointer.x = e.clientX - r.left;
			self.pointer.y = e.clientY - r.top;
		});
		host.addEventListener('pointerleave', function () { self.pointer.x = self.pointer.y = -9999; });
	}

	ParticleField.prototype.resize = function () {
		var r = this.canvas.getBoundingClientRect();
		if (!r.width || !r.height) { return; }
		var dpr = Math.min(window.devicePixelRatio || 1, 2);
		this.w = r.width;
		this.h = r.height;
		this.canvas.width = Math.round(r.width * dpr);
		this.canvas.height = Math.round(r.height * dpr);
		this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
		var count = Math.round(clamp((r.width * r.height) / 16000, 14, 64));
		while (this.points.length < count) {
			this.points.push({
				x: Math.random() * r.width,
				y: Math.random() * r.height,
				vx: (Math.random() - 0.5) * 0.22,
				vy: (Math.random() - 0.5) * 0.22,
				r: Math.random() * 1.2 + 0.7
			});
		}
		this.points.length = count;
		if (!this.running) { this.draw(); }
	};

	ParticleField.prototype.draw = function () {
		var ctx = this.ctx, pts = this.points, n = pts.length, w = this.w, h = this.h;
		var link = Math.min(140, Math.max(90, w / 10));
		var rgb = '170,205,255';
		ctx.clearRect(0, 0, w, h);
		for (var i = 0; i < n; i++) {
			var a = pts[i];
			for (var j = i + 1; j < n; j++) {
				var b = pts[j];
				var dx = a.x - b.x, dy = a.y - b.y;
				var d2 = dx * dx + dy * dy;
				if (d2 < link * link) {
					var alpha = (1 - Math.sqrt(d2) / link) * 0.22;
					ctx.strokeStyle = 'rgba(' + rgb + ',' + alpha.toFixed(3) + ')';
					ctx.lineWidth = 1;
					ctx.beginPath();
					ctx.moveTo(a.x, a.y);
					ctx.lineTo(b.x, b.y);
					ctx.stroke();
				}
			}
			var px = a.x - this.pointer.x, py = a.y - this.pointer.y;
			var pd2 = px * px + py * py;
			if (pd2 < 160 * 160) {
				ctx.strokeStyle = 'rgba(' + rgb + ',' + ((1 - Math.sqrt(pd2) / 160) * 0.3).toFixed(3) + ')';
				ctx.beginPath();
				ctx.moveTo(a.x, a.y);
				ctx.lineTo(this.pointer.x, this.pointer.y);
				ctx.stroke();
			}
			ctx.fillStyle = 'rgba(' + rgb + ',0.55)';
			ctx.beginPath();
			ctx.arc(a.x, a.y, a.r, 0, Math.PI * 2);
			ctx.fill();
		}
	};

	ParticleField.prototype.step = function () {
		var pts = this.points, w = this.w, h = this.h;
		for (var i = 0; i < pts.length; i++) {
			var p = pts[i];
			var px = p.x - this.pointer.x, py = p.y - this.pointer.y;
			var pd2 = px * px + py * py;
			if (pd2 < 120 * 120 && pd2 > 1) {
				var f = (1 - Math.sqrt(pd2) / 120) * 0.02;
				p.vx += px * f / 10;
				p.vy += py * f / 10;
			}
			p.vx *= 0.995;
			p.vy *= 0.995;
			if (Math.abs(p.vx) < 0.05) { p.vx += (Math.random() - 0.5) * 0.04; }
			if (Math.abs(p.vy) < 0.05) { p.vy += (Math.random() - 0.5) * 0.04; }
			p.x += p.vx;
			p.y += p.vy;
			if (p.x < -10) { p.x = w + 10; } else if (p.x > w + 10) { p.x = -10; }
			if (p.y < -10) { p.y = h + 10; } else if (p.y > h + 10) { p.y = -10; }
		}
	};

	ParticleField.prototype.frame = function () {
		if (!this.running) { return; }
		this.step();
		this.draw();
		this.raf = requestAnimationFrame(this.loop);
	};

	ParticleField.prototype.update = function () {
		var shouldRun = this.visible && isInteractive() && !reduceMotion && !document.hidden;
		if (shouldRun && !this.running) {
			this.running = true;
			this.raf = requestAnimationFrame(this.loop);
		} else if (!shouldRun && this.running) {
			this.running = false;
			cancelAnimationFrame(this.raf);
		}
	};

	var fields = [];
	function initParticles() {
		if (fields.length || !isInteractive()) { return; }
		$$('canvas.particles').forEach(function (canvas) {
			if (!canvas.getContext) { return; }
			var field = new ParticleField(canvas);
			fields.push(field);
			field.resize();
			if ('IntersectionObserver' in window) {
				new IntersectionObserver(function (entries) {
					field.visible = entries[0].isIntersecting;
					field.update();
				}).observe(canvas);
			} else {
				field.visible = true;
				field.update();
			}
		});
		if ('ResizeObserver' in window) {
			var ro = new ResizeObserver(function () { fields.forEach(function (f) { f.resize(); }); });
			fields.forEach(function (f) { ro.observe(f.canvas.parentElement); });
		}
	}
	document.addEventListener('visibilitychange', function () { fields.forEach(function (f) { f.update(); }); });

	/* ------------------------------------------------------------------ */
	/* Home intro: dots fill the space and gyrate around the logo on a      */
	/* tilted orbit, expand outwards and fade, then the logo grows          */
	/* (Interactive mode only, plays once per page load)                    */
	/* ------------------------------------------------------------------ */

	var ORBIT_COLORS = [[92, 163, 255], [31, 128, 255], [0, 74, 173]]; // the logo's three blues
	var ORBIT_SAMPLES = 720;
	var ORBIT_TILT = 16 * Math.PI / 180; // angle of the orbit axis, like the NASA orbit but flatter
	var ORBIT_SWAY = 2 * Math.PI / 180;
	var ORBIT_EXP = 2.6; // superellipse exponent: 2 is an ellipse, higher is boxier
	var INTRO = { logoIn: 0.3, logoInEnd: 1.7, expand: 4.2, expandEnd: 6.8, grow: 5.0, growEnd: 7.4, startScale: 0.6 };

	function easeInOut3(k) { return k < 0.5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2; }
	function smoothstep(a, b, x) { var k = clamp((x - a) / (b - a), 0, 1); return k * k * (3 - 2 * k); }

	function orbitColor(f, alpha) {
		var n = ORBIT_COLORS.length;
		var x = (f - Math.floor(f)) * n;
		var i = Math.floor(x);
		var k = x - i;
		k = k * k * (3 - 2 * k);
		var a = ORBIT_COLORS[i % n], b = ORBIT_COLORS[(i + 1) % n];
		return 'rgba(' + Math.round(a[0] + (b[0] - a[0]) * k) + ',' + Math.round(a[1] + (b[1] - a[1]) * k) + ',' + Math.round(a[2] + (b[2] - a[2]) * k) + ',' + alpha.toFixed(3) + ')';
	}

	// Points spaced evenly along a rounded, oblong superellipse, so dots travel around it at a steady speed.
	function orbitPath(a, b) {
		var fine = 1440, exp = 2 / ORBIT_EXP, xs = [], ys = [], len = [0], i;
		for (i = 0; i <= fine; i++) {
			var th = (i / fine) * Math.PI * 2;
			var c = Math.cos(th), s = Math.sin(th);
			xs.push(a * (c < 0 ? -1 : 1) * Math.pow(Math.abs(c), exp));
			ys.push(b * (s < 0 ? -1 : 1) * Math.pow(Math.abs(s), exp));
			if (i) { len.push(len[i - 1] + Math.sqrt(Math.pow(xs[i] - xs[i - 1], 2) + Math.pow(ys[i] - ys[i - 1], 2))); }
		}
		var total = len[fine], pts = new Float32Array(ORBIT_SAMPLES * 2), j = 0;
		for (i = 0; i < ORBIT_SAMPLES; i++) {
			var target = (i / ORBIT_SAMPLES) * total;
			while (j < fine - 1 && len[j + 1] < target) { j++; }
			var seg = len[j + 1] - len[j] || 1;
			var u = (target - len[j]) / seg;
			pts[i * 2] = xs[j] + (xs[j + 1] - xs[j]) * u;
			pts[i * 2 + 1] = ys[j] + (ys[j + 1] - ys[j]) * u;
		}
		return { pts: pts, length: total };
	}

	// True when the point lies inside the superellipse (a, b) turned by every tilt the sway can reach.
	function orbitContains(a, b, x, y) {
		for (var s = -1; s <= 1; s++) {
			var th = ORBIT_TILT + s * ORBIT_SWAY, c = Math.cos(th), n = Math.sin(th);
			var u = x * c + y * n, v = -x * n + y * c;
			if (Math.pow(Math.abs(u / a), ORBIT_EXP) + Math.pow(Math.abs(v / b), ORBIT_EXP) > 1) { return false; }
		}
		return true;
	}

	function IntroOrbit(root) {
		this.root = root;
		this.canvas = $('canvas', root);
		this.logo = $('.intro__logo', root);
		this.ctx = this.canvas.getContext('2d');
		this.rings = [];
		this.w = 0;
		this.h = 0;
		this.lw = 0;
		this.lh = 0;
		this.dotMax = 10;
		this.t = 0;
		this.spin = 0;
		this.last = 0;
		this.visible = false;
		this.running = false;
		this.done = false;
		this.raf = 0;
		var self = this;
		this.loop = function (now) { self.frame(now); };
	}

	IntroOrbit.prototype.resize = function () {
		if (this.done) { return; }
		var r = this.canvas.getBoundingClientRect();
		if (!r.width || !r.height) { return; }
		var dpr = Math.min(window.devicePixelRatio || 1, 2);
		var w = this.w = r.width, h = this.h = r.height;
		this.canvas.width = Math.round(w * dpr);
		this.canvas.height = Math.round(h * dpr);
		this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
		this.lw = this.logo.offsetWidth;
		this.lh = this.logo.offsetHeight;

		// Rings start just outside the logo as it first appears (small) and continue until they
		// cover the corners, so the dots fill the whole section. Neighbouring rings are at least
		// `sep` apart and dots are sized below half of it, so no two dots ever touch.
		var lw = this.lw * INTRO.startScale, lh = this.lh * INTRO.startScale;
		var sep = clamp(h / 12, 22, 44);
		var gapB = sep, gapA = sep * clamp(w / h, 1, 2.4);
		var pad = clamp(lw * 0.1, 18, 44);
		var a0 = lw / 2 + pad, b0 = lh / 2 + pad;
		var count = 1;
		while (count < 40 && !(orbitContains(a0 + gapA * (count - 1), b0 + gapB * (count - 1), w / 2, h / 2) &&
			orbitContains(a0 + gapA * (count - 1), b0 + gapB * (count - 1), w / 2, -h / 2))) { count++; }
		count += 1;
		this.dotMax = sep * 0.85 / (2 * 1.06); // 1.06 = largest pulse (breath)
		this.rings = [];
		for (var k = 0; k < count; k++) {
			var a = a0 + gapA * k, b = b0 + gapB * k;
			var path = orbitPath(a, b);
			var scale = 0.6 + 0.4 * (count > 1 ? k / (count - 1) : 1);
			var n = Math.max(8, Math.floor(path.length / (2.6 * this.dotMax * scale * 1.06)));
			this.rings.push({ a: a, b: b, path: path.pts, n: n, scale: scale });
		}
		if (!this.running) { this.draw(this.t); }
	};

	IntroOrbit.prototype.logoState = function (t) {
		var lo = easeInOut3(clamp((t - INTRO.logoIn) / (INTRO.logoInEnd - INTRO.logoIn), 0, 1));
		var gr = easeInOut3(clamp((t - INTRO.grow) / (INTRO.growEnd - INTRO.grow), 0, 1));
		return { opacity: lo, lift: (1 - lo) * 28, scale: (INTRO.startScale + (1 - INTRO.startScale) * gr) * (0.92 + 0.08 * lo) };
	};

	IntroOrbit.prototype.draw = function (t) {
		var ctx = this.ctx, w = this.w, h = this.h, cx = w / 2, cy = h / 2;
		var count = this.rings.length;
		var breath = 1 + 0.06 * Math.sin(t * 1.4);
		var x = easeInOut3(clamp((t - INTRO.expand) / (INTRO.expandEnd - INTRO.expand), 0, 1));
		var spread = 1 + 1.6 * x;
		var fadeOut = 1 - easeInOut3(clamp((t - INTRO.expand - 0.4) / (INTRO.expandEnd - INTRO.expand - 0.4), 0, 1));
		var tilt = ORBIT_TILT + ORBIT_SWAY * Math.sin(t * 0.6);
		var cosT = Math.cos(tilt), sinT = Math.sin(tilt);
		ctx.clearRect(0, 0, w, h);
		for (var k = 0; k < count; k++) {
			var ring = this.rings[k];
			// Fill in as a quick ripple from the centre outwards.
			var e = easeInOut3(clamp((t - 0.4 * k / count) / 1.0, 0, 1));
			if (e <= 0 || fadeOut <= 0) { continue; }
			var phase = this.spin * (1 + 0.25 * k / count) + 0.5 * (k % 2) / ring.n;
			var pts = ring.path;
			var rMax = this.dotMax * ring.scale;
			for (var i = 0; i < ring.n; i++) {
				var s = i / ring.n + phase;
				s -= Math.floor(s);
				var idx = s * ORBIT_SAMPLES, i0 = Math.floor(idx), f = idx - i0, i1 = (i0 + 1) % ORBIT_SAMPLES;
				var ux = pts[i0 * 2] + (pts[i1 * 2] - pts[i0 * 2]) * f;
				var uy = pts[i0 * 2 + 1] + (pts[i1 * 2 + 1] - pts[i0 * 2 + 1]) * f;
				var px = cx + (ux * cosT - uy * sinT) * spread;
				var py = cy + (ux * sinT + uy * cosT) * spread;
				if (px < -rMax || px > w + rMax || py < -rMax || py > h + rMax) { continue; }
				// Fade towards white near the edges of the section.
				var dx = (px - cx) / cx, dy = (py - cy) / cy;
				var edge = 1 - smoothstep(0.5, 1.2, Math.sqrt(dx * dx + dy * dy));
				var alpha = 0.92 * e * fadeOut * edge;
				if (alpha < 0.01) { continue; }
				var ang = Math.atan2(uy / ring.b, ux / ring.a);
				var wave = 0.5 + 0.5 * Math.sin(ang * 3 - t * 1.7 + k * 0.5);
				var size = rMax * (0.45 + 0.55 * wave) * breath * e * (1 - 0.35 * x);
				ctx.fillStyle = orbitColor(ang / (Math.PI * 2) + t * 0.02 + k * 0.01, alpha);
				ctx.beginPath();
				ctx.arc(px, py, size, 0, Math.PI * 2);
				ctx.fill();
			}
		}

		// A soft white glow behind the logo keeps it readable over the dots.
		var logo = this.logoState(t);
		var rx = this.lw * logo.scale * 0.62, ry = this.lh * logo.scale * 1.5;
		if (logo.opacity > 0 && rx > 0 && ry > 0) {
			ctx.save();
			ctx.translate(cx, cy - logo.lift);
			ctx.scale(rx, ry);
			var glow = ctx.createRadialGradient(0, 0, 0, 0, 0, 1);
			glow.addColorStop(0, 'rgba(255,255,255,' + (0.95 * logo.opacity).toFixed(3) + ')');
			glow.addColorStop(0.65, 'rgba(255,255,255,' + (0.8 * logo.opacity).toFixed(3) + ')');
			glow.addColorStop(1, 'rgba(255,255,255,0)');
			ctx.fillStyle = glow;
			ctx.beginPath();
			ctx.arc(0, 0, 1, 0, Math.PI * 2);
			ctx.fill();
			ctx.restore();
		}
	};

	IntroOrbit.prototype.drawLogo = function (t) {
		var logo = this.logoState(t);
		this.logo.style.opacity = logo.opacity.toFixed(3);
		this.logo.style.transform = 'translateY(' + logo.lift.toFixed(1) + 'px) scale(' + logo.scale.toFixed(4) + ')';
	};

	IntroOrbit.prototype.finish = function () {
		this.done = true;
		this.running = false;
		cancelAnimationFrame(this.raf);
		this.ctx.clearRect(0, 0, this.w, this.h);
		this.logo.style.opacity = '';
		this.logo.style.transform = '';
		this.root.classList.add('is-done');
	};

	IntroOrbit.prototype.frame = function (now) {
		if (!this.running) { return; }
		var dt = this.last ? Math.min((now - this.last) / 1000, 0.05) : 0;
		this.last = now;
		this.t += dt;
		if (this.t >= INTRO.growEnd) { this.finish(); return; }
		// Spin speed (turns per second) eases up at the start and eases down while the dots expand.
		var up = easeInOut3(clamp(this.t / 1.6, 0, 1));
		var down = 1 - 0.7 * easeInOut3(clamp((this.t - INTRO.expand) / (INTRO.expandEnd - INTRO.expand), 0, 1));
		this.spin += 0.07 * up * down * dt;
		this.draw(this.t);
		this.drawLogo(this.t);
		this.raf = requestAnimationFrame(this.loop);
	};

	IntroOrbit.prototype.update = function () {
		if (this.done) { return; }
		var shouldRun = this.visible && isInteractive() && !reduceMotion && !document.hidden;
		if (shouldRun && !this.running) {
			this.running = true;
			this.last = 0;
			this.raf = requestAnimationFrame(this.loop);
		} else if (!shouldRun && this.running) {
			this.running = false;
			cancelAnimationFrame(this.raf);
		}
	};

	var introRoot = $('.intro');
	if (introRoot) {
		var introCanvas = $('canvas', introRoot);
		if (reduceMotion || !introCanvas || !introCanvas.getContext) {
			introRoot.classList.add('is-done'); // no animation: show the finished state
		} else {
			var orbit = new IntroOrbit(introRoot);
			orbit.resize();
			if ('IntersectionObserver' in window) {
				new IntersectionObserver(function (entries) {
					orbit.visible = entries[0].isIntersecting;
					orbit.update();
				}).observe(introRoot);
			} else {
				orbit.visible = true;
				orbit.update();
			}
			if ('ResizeObserver' in window) {
				new ResizeObserver(function () { orbit.resize(); orbit.update(); }).observe(introRoot);
			}
			document.addEventListener('visibilitychange', function () { orbit.update(); });
			if ('MutationObserver' in window) {
				new MutationObserver(function () { orbit.resize(); orbit.update(); }).observe(html, { attributes: true, attributeFilter: ['data-mode'] });
			}
		}
	}

	/* ------------------------------------------------------------------ */
	/* Lightbox (App screenshots)                                          */
	/* ------------------------------------------------------------------ */

	function initLightbox(container) {
		var links = $$('a[href]', container);
		if (!links.length) { return; }
		var box = null, img, count, index = 0, opener = null;

		function icon(path) {
			return '<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="' + path + '"/></svg>';
		}

		function build() {
			box = document.createElement('div');
			box.className = 'lightbox';
			box.setAttribute('role', 'dialog');
			box.setAttribute('aria-modal', 'true');
			box.setAttribute('aria-label', 'Image viewer');
			box.innerHTML =
				'<img class="lightbox__img" alt="" />' +
				'<button type="button" class="lightbox__btn lightbox__close" aria-label="Close">' + icon('M6 6l12 12M18 6 6 18') + '</button>' +
				'<button type="button" class="lightbox__btn lightbox__prev" aria-label="Previous image">' + icon('M15 5l-7 7 7 7') + '</button>' +
				'<button type="button" class="lightbox__btn lightbox__next" aria-label="Next image">' + icon('M9 5l7 7-7 7') + '</button>' +
				'<p class="lightbox__count" aria-live="polite"></p>';
			img = $('.lightbox__img', box);
			count = $('.lightbox__count', box);
			$('.lightbox__close', box).addEventListener('click', close);
			$('.lightbox__prev', box).addEventListener('click', function () { show(index - 1); });
			$('.lightbox__next', box).addEventListener('click', function () { show(index + 1); });
			box.addEventListener('click', function (e) { if (e.target === box) { close(); } });
			box.addEventListener('keydown', function (e) {
				if (e.key === 'Escape') { close(); }
				else if (e.key === 'ArrowLeft') { show(index - 1); }
				else if (e.key === 'ArrowRight') { show(index + 1); }
				else if (e.key === 'Tab') {
					var focusables = $$('button', box);
					var first = focusables[0], last = focusables[focusables.length - 1];
					if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
					else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
				}
			});
			var touchX = null;
			box.addEventListener('touchstart', function (e) { touchX = e.touches[0].clientX; }, { passive: true });
			box.addEventListener('touchend', function (e) {
				if (touchX === null) { return; }
				var dx = e.changedTouches[0].clientX - touchX;
				if (Math.abs(dx) > 50) { show(index + (dx < 0 ? 1 : -1)); }
				touchX = null;
			});
		}

		function show(i) {
			index = (i + links.length) % links.length;
			var link = links[index];
			var thumb = $('img', link);
			img.src = link.getAttribute('href');
			img.alt = thumb ? thumb.alt : '';
			count.textContent = (index + 1) + ' / ' + links.length;
		}

		function open(i, trigger) {
			if (!box) { build(); }
			opener = trigger;
			show(i);
			document.body.appendChild(box);
			document.body.style.overflow = 'hidden';
			requestAnimationFrame(function () { box.classList.add('is-open'); });
			$('.lightbox__close', box).focus();
		}

		function close() {
			if (!box || !box.parentNode) { return; }
			box.classList.remove('is-open');
			document.body.style.overflow = '';
			box.parentNode.removeChild(box);
			if (opener) { opener.focus(); }
		}

		links.forEach(function (link, i) {
			link.addEventListener('click', function (e) {
				if (e.metaKey || e.ctrlKey || e.shiftKey) { return; }
				e.preventDefault();
				open(i, link);
			});
		});
	}
	$$('[data-lightbox]').forEach(initLightbox);

	/* ------------------------------------------------------------------ */
	/* Cookie notice (same choice cookie as the original site)              */
	/* ------------------------------------------------------------------ */

	var notice = $('.cookie-notice');
	if (notice && !/(?:^|;\s*)__cookie_law__=\d+/.test(document.cookie)) {
		notice.hidden = false;
		$$('[data-cookie]', notice).forEach(function (btn) {
			btn.addEventListener('click', function () {
				var accepted = btn.getAttribute('data-cookie') === 'accept';
				var expires = new Date(Date.now() + 365 * 864e5).toUTCString();
				store('allowedCookies', accepted ? '["*"]' : '[]');
				document.cookie = '__cookie_law__=2; path=/; expires=' + expires + '; SameSite=Lax';
				notice.hidden = true;
			});
		});
	}

	/* ------------------------------------------------------------------ */
	/* Mode lifecycle                                                      */
	/* ------------------------------------------------------------------ */

	function onModeChange() {
		measureHeader();
		if (isInteractive()) {
			initParticles();
			fields.forEach(function (f) { f.resize(); f.update(); });
			updateScroll();
		} else {
			fields.forEach(function (f) { f.update(); });
			resetScrollEffects();
			counters.forEach(function (el) { el.textContent = el.getAttribute('data-final'); });
		}
	}

	syncModeControls();
	measureHeader();
	if (isInteractive()) {
		initParticles();
		if (reduceMotion) { resetScrollEffects(); }
	} else {
		resetScrollEffects();
	}
	updateScroll();
})();
