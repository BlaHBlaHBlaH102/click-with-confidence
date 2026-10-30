/*
 * Click With Confidence — flip-book PDF reader (Docs & Presentations page).
 *
 * Renders a PDF with PDF.js and shows it as a book with StPageFlip: page-turn
 * animation, thumbnail strip, page slider, page-number box and download link.
 * Markup lives in presentations page file (.reader); styles are in css/cwc.css.
 * Both libraries are self-hosted in js/vendor/.
 */
(function () {
	'use strict';

	var root = document.querySelector('.reader');
	if (!root || !window.pdfjsLib || !window.St) { return; }

	function $(sel) { return root.querySelector(sel); }

	var stage = $('.reader__stage');
	var bookHost = $('.reader__book');
	var thumbsBox = $('.reader__thumbs');
	var pageInput = $('.reader__page-input');
	var pageTotal = $('.reader__page-total');
	var slider = $('.reader__slider');
	var status = $('.reader__status');
	var btnPrev = $('[data-reader="prev"]');
	var btnNext = $('[data-reader="next"]');
	var btnFull = $('[data-reader="full"]');
	var btnThumbs = $('[data-reader="thumbs"]');

	var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
	var pdf, flip, ratio = 1.294, total = 0, current = 0, fitTimer;
	var pageImgs = [], thumbBtns = [], thumbImgs = [];

	function abs(url) { return new URL(url, document.baseURI).href; }

	function fail() {
		root.classList.remove('is-loading');
		root.classList.add('is-failed');
	}

	/* ---------- Rendering ---------- */

	function renderToBlob(page, width) {
		var vp1 = page.getViewport({ scale: 1 });
		var scale = width / vp1.width;
		var vp = page.getViewport({ scale: scale });
		var canvas = document.createElement('canvas');
		canvas.width = Math.floor(vp.width);
		canvas.height = Math.floor(vp.height);
		var ctx = canvas.getContext('2d');
		ctx.fillStyle = '#fff';
		ctx.fillRect(0, 0, canvas.width, canvas.height);
		return page.render({ canvasContext: ctx, viewport: vp }).promise.then(function () {
			return new Promise(function (resolve) {
				canvas.toBlob(function (blob) { resolve({ blob: blob, canvas: canvas }); }, 'image/jpeg', 0.95);
			});
		});
	}

	function drawThumb(i, source) {
		var img = thumbImgs[i];
		var w = 280;
		var c = document.createElement('canvas');
		c.width = w;
		c.height = Math.round(w * source.height / source.width);
		var tctx = c.getContext('2d');
		tctx.imageSmoothingQuality = 'high';
		tctx.drawImage(source, 0, 0, c.width, c.height);
		img.src = c.toDataURL('image/jpeg', 0.8);
		img.parentNode.classList.add('is-ready');
	}

	/* Render pages in the order a reader needs them: the first spread, then outward. */
	function renderAll(order, width) {
		var chain = Promise.resolve();
		order.forEach(function (i) {
			chain = chain.then(function () {
				return pdf.getPage(i + 1).then(function (page) {
					return renderToBlob(page, width);
				}).then(function (r) {
					pageImgs[i].src = URL.createObjectURL(r.blob);
					pageImgs[i].parentNode.classList.add('is-ready');
					drawThumb(i, r.canvas);
				});
			});
		});
		return chain;
	}

	/* ---------- Navigation state ---------- */

	function visiblePages() {
		if (!flip) { return [current]; }
		if (flip.getOrientation() === 'portrait' || current === 0) { return [current]; }
		if (current + 1 < total) { return [current, current + 1]; }
		return [current];
	}

	function sync() {
		var vis = visiblePages();
		pageInput.value = vis[0] + 1;
		slider.value = vis[0] + 1;
		status.textContent = vis.length > 1 ? 'Pages ' + (vis[0] + 1) + ' and ' + (vis[1] + 1) + ' of ' + total : 'Page ' + (vis[0] + 1) + ' of ' + total;
		thumbBtns.forEach(function (b, i) {
			var on = vis.indexOf(i) !== -1;
			b.classList.toggle('is-current', on);
			if (on) { b.setAttribute('aria-current', 'true'); } else { b.removeAttribute('aria-current'); }
		});
		/* A lone cover or back cover sits on one side of the spine; slide the book so it is centred. */
		var lone = flip && flip.getOrientation() === 'landscape' && vis.length === 1;
		root.classList.toggle('at-start', !!lone && vis[0] === 0);
		root.classList.toggle('at-end', !!lone && vis[0] > 0);
		btnPrev.disabled = vis[0] === 0;
		btnNext.disabled = vis[vis.length - 1] >= total - 1;
		slider.style.setProperty('--fill', total > 1 ? ((vis[0]) / (total - 1) * 100) + '%' : '0%');
		var cur = thumbBtns[vis[0]];
		if (cur) {
			var horizontal = getComputedStyle(thumbsBox).flexDirection.indexOf('row') === 0;
			if (horizontal) { thumbsBox.scrollTo({ left: cur.offsetLeft - thumbsBox.clientWidth / 2 + cur.offsetWidth / 2, behavior: 'smooth' }); }
			else { thumbsBox.scrollTo({ top: cur.offsetTop - thumbsBox.clientHeight / 2 + cur.offsetHeight / 2, behavior: 'smooth' }); }
		}
	}

	function go(i) {
		i = Math.max(0, Math.min(total - 1, i));
		if (reduceMotion) { flip.turnToPage(i); current = flip.getCurrentPageIndex(); sync(); }
		else { flip.flip(i); }
	}

	/* Size the reader to the book (page height from the stage width) so there is no empty band under it. */
	function fit() {
		if (root.classList.contains('is-full')) { return; }
		var pad = parseFloat(getComputedStyle(stage).paddingLeft) || 0;
		var w = stage.clientWidth - 2 * pad;
		var pw = Math.min(w >= 520 ? w / 2 : w, 900);
		var h = Math.round(pw * ratio + 2 * pad);
		h = Math.max(360, Math.min(h, Math.round(window.innerHeight * 0.9)));
		root.style.setProperty('--reader-h', h + 'px');
		if (flip) { flip.update(); }
	}

	/* ---------- Build ---------- */

	function build(firstPage) {
		var vp = firstPage.getViewport({ scale: 1 });
		ratio = vp.height / vp.width;
		var baseW = 520, baseH = Math.round(baseW * ratio);

		fit();
		pageTotal.textContent = total;
		pageInput.max = total;
		slider.max = total;

		var frag = document.createDocumentFragment();
		var pages = [];
		var thumbFrag = document.createDocumentFragment();

		for (var i = 0; i < total; i++) {
			var p = document.createElement('div');
			p.className = 'reader__page';
			if (i === 0 || i === total - 1) { p.setAttribute('data-density', 'hard'); }
			var img = document.createElement('img');
			img.alt = 'Page ' + (i + 1) + ' of the report';
			img.draggable = false;
			p.appendChild(img);
			pageImgs.push(img);
			pages.push(p);

			var b = document.createElement('button');
			b.type = 'button';
			b.className = 'reader__thumb';
			b.setAttribute('aria-label', 'Go to page ' + (i + 1));
			var ti = document.createElement('img');
			ti.alt = '';
			ti.style.aspectRatio = '1 / ' + ratio.toFixed(4);
			var num = document.createElement('span');
			num.textContent = i + 1;
			b.appendChild(ti);
			b.appendChild(num);
			(function (n) { b.addEventListener('click', function () { go(n); }); })(i);
			thumbFrag.appendChild(b);
			thumbBtns.push(b);
			thumbImgs.push(ti);
		}
		thumbsBox.appendChild(thumbFrag);

		var host = document.createElement('div');
		host.className = 'reader__flip';
		bookHost.appendChild(host);

		flip = new St.PageFlip(host, {
			width: baseW,
			height: baseH,
			size: 'stretch',
			minWidth: 260,
			maxWidth: 900,
			minHeight: Math.round(260 * ratio),
			maxHeight: Math.round(900 * ratio),
			showCover: true,
			usePortrait: true,
			maxShadowOpacity: 0.45,
			flippingTime: reduceMotion ? 1 : 900,
			mobileScrollSupport: false,
			drawShadow: true,
			startPage: 0
		});
		flip.loadFromHTML(pages);
		flip.on('flip', function (e) { current = e.data; sync(); });
		flip.on('changeOrientation', function () { sync(); });
		flip.on('init', sync);
		root.classList.remove('is-loading');
		root.classList.add('is-ready');
		current = 0;
		sync();

		/* Render sharply enough for the largest page on screen, capped for memory. */
		/* Render at twice the largest size a page is shown (full screen included), so the browser only ever scales down a little. */
		var cssW = Math.min(900, Math.max(stage.clientWidth / 2, (screen.height * 0.85) / ratio));
		var width = Math.min(2000, Math.max(1200, Math.round(cssW * Math.max(window.devicePixelRatio || 1, 2))));
		var order = [];
		for (var k = 0; k < total; k++) { order.push(k); }
		renderAll(order, width).catch(fail);
	}

	/* ---------- Controls ---------- */

	function spread() { return flip && flip.getOrientation() === 'landscape'; }
	btnPrev.addEventListener('click', function () { var v = visiblePages()[0]; go(spread() ? (v <= 1 ? 0 : v - 2) : v - 1); });
	btnNext.addEventListener('click', function () { var v = visiblePages()[0]; go(spread() ? (v === 0 ? 1 : v + 2) : v + 1); });

	function jumpFromInput() {
		var n = parseInt(pageInput.value, 10);
		if (isNaN(n)) { sync(); return; }
		go(n - 1);
	}
	pageInput.addEventListener('change', jumpFromInput);
	pageInput.addEventListener('keydown', function (e) {
		if (e.key === 'Enter') { e.preventDefault(); jumpFromInput(); pageInput.blur(); }
		e.stopPropagation();
	});
	pageInput.addEventListener('focus', function () { pageInput.select(); });

	slider.addEventListener('input', function () {
		slider.style.setProperty('--fill', total > 1 ? ((slider.value - 1) / (total - 1) * 100) + '%' : '0%');
		pageInput.value = slider.value;
	});
	slider.addEventListener('change', function () { go(parseInt(slider.value, 10) - 1); });

	root.addEventListener('keydown', function (e) {
		if (e.target === slider || e.target === pageInput) { return; }
		if (e.key === 'ArrowLeft') { btnPrev.click(); e.preventDefault(); }
		else if (e.key === 'ArrowRight') { btnNext.click(); e.preventDefault(); }
		else if (e.key === 'Home') { go(0); e.preventDefault(); }
		else if (e.key === 'End') { go(total - 1); e.preventDefault(); }
	});

	if (btnThumbs) {
		btnThumbs.addEventListener('click', function () {
			var hidden = root.classList.toggle('thumbs-hidden');
			btnThumbs.setAttribute('aria-pressed', hidden ? 'false' : 'true');
			setTimeout(function () { if (flip) { flip.update(); } }, 320);
		});
	}

	if (btnFull) {
		if (!root.requestFullscreen) { btnFull.hidden = true; }
		btnFull.addEventListener('click', function () {
			if (document.fullscreenElement) { document.exitFullscreen(); } else { root.requestFullscreen(); }
		});
		document.addEventListener('fullscreenchange', function () {
			root.classList.toggle('is-full', document.fullscreenElement === root);
			setTimeout(function () { fit(); if (flip) { flip.update(); } }, 150);
		});
	}

	window.addEventListener('resize', function () { clearTimeout(fitTimer); fitTimer = setTimeout(fit, 120); });

	/* ---------- Start ---------- */

	root.classList.add('is-loading');
	pdfjsLib.GlobalWorkerOptions.workerSrc = abs(root.getAttribute('data-worker'));
	pdfjsLib.getDocument(abs(root.getAttribute('data-pdf'))).promise.then(function (doc) {
		pdf = doc;
		total = doc.numPages;
		return doc.getPage(1);
	}).then(build).catch(fail);
})();
