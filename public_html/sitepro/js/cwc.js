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
		}, { threshold: 0.6 });
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
