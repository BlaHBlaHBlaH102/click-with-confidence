/*
 * Click With Confidence - "Scam Stopper" daily game (home page).
 *
 * Each day shows one scam message cut into 16 pieces. The player taps a piece and
 * decides: Safe or Red flag. A safe piece shows how many red flags touch it (the
 * pieces next to it, corners included), like Minesweeper. Three wrong calls end the
 * game. The game for each day comes from js/scam-stopper-data.js and is the same for
 * everyone; each visitor plays it once per day. Progress and streaks live in this
 * browser's localStorage (key "cwc-game"); the day changes at local midnight.
 */
(function () {
	'use strict';

	var root = document.querySelector('[data-game]');
	var G = window.CWC_GAME;
	if (!root || !G || !G.make) { return; }

	var body = root.querySelector('.game__body');
	var KEY = 'cwc-game';
	var MAX = G.strikes || 3;
	var ICON_FLAG = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 21V4m0 0h11l-2.5 4L17 12H6"/></svg>';
	var ICON_CHECK = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>';
	var ICON_SHIELD = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3l7.5 3v5.5c0 4.6-3.1 8.2-7.5 9.5-4.4-1.3-7.5-4.9-7.5-9.5V6L12 3z"/></svg>';

	/* Role of each piece (see the tile layout in scam-stopper-data.js); styles key off it. */
	function ROLE(i) { return i === 0 ? 'from' : i === 1 ? 'subj' : i === 2 ? 'greet' : i === 3 ? 'open' : i === 14 ? 'link' : i === 15 ? 'sign' : 'body'; }

	/* Decorative app chrome around the message, one per kind. Static markup, hidden from screen readers. */
	function ico(d, cls) { return '<svg class="' + (cls || 'ico') + '" viewBox="0 0 24 24" aria-hidden="true">' + d + '</svg>'; }
	var CHROME = {
		email: {
			head: ico('<path d="M20 11H7.8l5.6-5.6L12 4l-8 8 8 8 1.4-1.4L7.8 13H20z"/>') +
				'<span class="app__sp"></span>' +
				ico('<path d="M20.5 6.5l-1.4-1.9A1.5 1.5 0 0 0 18 4H6c-.5 0-.9.2-1.2.6L3.5 6.5C3.2 6.8 3 7.200 3 7.600V19a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V7.600c0-.4-.2-.8-.5-1.100zM12 17.500 6.500 12H10v-2h4v2h3.500L12 17.500zM5.100 6l.8-1h12l.9 1H5.100z"/>') +
				ico('<path d="M6 19a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V7H6v12zM19 4h-3.500l-1-1h-5l-1 1H5v2h14V4z"/>') +
				ico('<path d="M20 4H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2zm0 4-8 5-8-5V6l8 5 8-5v2z"/>') +
				ico('<path d="M12 8a2 2 0 1 0 0-4 2 2 0 0 0 0 4zm0 2a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm0 6a2 2 0 1 0 0 4 2 2 0 0 0 0-4z"/>'),
			foot: '<span class="gm-pill">' + ico('<path d="M10 9V5l-7 7 7 7v-4.100c5 0 8.500 1.600 11 5.100-1-5-4-10-11-11z"/>') + 'Reply</span><span class="gm-pill">' + ico('<path d="M14 9V5l7 7-7 7v-4.100c-5 0-8.500 1.600-11 5.100 1-5 4-10 11-11z"/>') + 'Forward</span>'
		},
		text: {
			head: '<span class="im-back">' + ico('<path d="M15.400 5.400 14 4l-8 8 8 8 1.400-1.400L8.800 12z"/>') + '</span>' +
				'<span class="im-who"><span class="im-avatar">' + ico('<path d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zm0 2c-3.300 0-8 1.700-8 5v1h16v-1c0-3.300-4.700-5-8-5z"/>') + '</span><span class="im-name">New message <span class="im-chev">&rsaquo;</span></span></span>' +
				'<span class="im-vid">' + ico('<path d="M17 10.500V7a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-3.500l4 4v-11l-4 4z"/>') + '</span>',
			foot: '<span class="im-plus">+</span><span class="im-field">Text Message</span>'
		},
		voicemail: {
			head: '<span class="vm-back">' + ico('<path d="M15.400 5.400 14 4l-8 8 8 8 1.400-1.400L8.800 12z"/>') + 'Voicemail</span><span class="vm-edit">Share</span>',
			foot: '<span class="vm-play">' + ico('<path d="M8 5v14l11-7z"/>') + '</span><span class="vm-bar"><span class="vm-fill"></span></span><span class="vm-time">0:42</span>' +
				'<span class="vm-acts"><span class="vm-act">' + ico('<path d="M6.600 10.800a15.100 15.100 0 0 0 6.600 6.600l2.200-2.200c.3-.3.700-.4 1-.2 1.100.4 2.300.6 3.600.6.600 0 1 .4 1 1V20c0 .6-.4 1-1 1A17 17 0 0 1 3 4c0-.6.400-1 1-1h3.500c.6 0 1 .4 1 1 0 1.300.2 2.500.6 3.600.1.300 0 .7-.2 1l-2.300 2.200z"/>') + 'Call Back</span><span class="vm-act">' + ico('<path d="M6 19a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V7H6v12zM19 4h-3.500l-1-1h-5l-1 1H5v2h14V4z"/>') + 'Delete</span></span>'
		},
		popup: {
			head: '<span class="br-dots"><i></i><i></i><i></i></span><span class="br-tab">Alert</span>' +
				'<span class="br-bar">' + ico('<path d="M12 1 3 5v6c0 5.500 3.800 10.700 9 12 5.200-1.300 9-6.500 9-12V5l-9-4zm0 10.900h7c-.5 4.200-3.400 8-7 9.100V12H5V6.300l7-3.100v8.700z"/>') + '<span>https://</span></span>',
			foot: ''
		},
		dm: {
			head: '<span class="wa-back">' + ico('<path d="M20 11H7.800l5.600-5.600L12 4l-8 8 8 8 1.400-1.400L7.800 13H20z"/>') + '</span>' +
				'<span class="wa-avatar">' + ico('<path d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zm0 2c-3.300 0-8 1.700-8 5v1h16v-1c0-3.300-4.700-5-8-5z"/>') + '</span>' +
				'<span class="wa-who"><b>New chat</b><small>online</small></span>' +
				'<span class="app__sp"></span>' + ico('<path d="M17 10.500V7a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-3.500l4 4v-11l-4 4z"/>') +
				ico('<path d="M12 8a2 2 0 1 0 0-4 2 2 0 0 0 0 4zm0 2a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm0 6a2 2 0 1 0 0 4 2 2 0 0 0 0-4z"/>'),
			foot: '<span class="wa-field">Type a message</span><span class="wa-mic">' + ico('<path d="M12 14a3 3 0 0 0 3-3V5a3 3 0 0 0-6 0v6a3 3 0 0 0 3 3zm5-3a5 5 0 0 1-10 0H5a7 7 0 0 0 6 6.900V21h2v-3.100A7 7 0 0 0 19 11h-2z"/>') + '</span>'
		}
	};

	function pad(n) { return (n < 10 ? '0' : '') + n; }
	function dayKey(d) { return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()); }

	/* Whole days since the first game, counted on calendar dates so daylight saving cannot shift it. */
	function dayNumber(d) {
		var today = Date.UTC(d.getFullYear(), d.getMonth(), d.getDate());
		var start = Date.UTC(G.start[0], G.start[1] - 1, G.start[2]);
		return Math.max(0, Math.floor((today - start) / 86400000));
	}

	function load() {
		try { return JSON.parse(localStorage.getItem(KEY)) || {}; } catch (e) { return {}; }
	}
	function save(state) {
		try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) {}
	}

	function el(tag, cls, text) {
		var n = document.createElement(tag);
		if (cls) { n.className = cls; }
		if (text !== undefined) { n.textContent = text; }
		return n;
	}

	function untilTomorrow(now) {
		var next = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
		var mins = Math.max(1, Math.round((next - now) / 60000));
		var h = Math.floor(mins / 60), m = mins % 60;
		return (h ? h + (h === 1 ? ' hour' : ' hours') + (m ? ' ' : '') : '') + (m || !h ? m + (m === 1 ? ' minute' : ' minutes') : '');
	}

	function shorten(text, max) { return text.length > max ? text.slice(0, max - 1) + '…' : text; }

	function render() {
		var now = new Date();
		var key = dayKey(now);
		var num = dayNumber(now);
		var game = G.make(num);
		var st = load();
		if (st.day !== key || !st.moves) {
			st = { day: key, moves: [], done: false, won: false, streak: st.streak || 0, played: st.played || 0, wins: st.wins || 0, last: st.last || '' };
		}
		var sel = -1;
		var note = st.moves.length ? '' : 'We cleared one piece to get you started. Tap another piece to continue.';
		var focusIdx = -1;

		/* Work out where the game stands from the saved moves. */
		function derive() {
			var res = [], strikes = 0, found = 0, resolved = 1;
			res[game.start] = { call: 's', ok: true, auto: true };
			st.moves.forEach(function (m) {
				var t = game.tiles[m[0]];
				var ok = (m[1] === 'f') === !!t.f;
				if (!res[m[0]]) { resolved++; }
				res[m[0]] = { call: m[1], ok: ok };
				if (!ok) { strikes++; }
			});
			game.tiles.forEach(function (t, i) { if (t.f && res[i] && res[i].call === 'f') { found++; } });
			var lost = strikes >= MAX;
			return { res: res, strikes: strikes, found: found, lost: lost, won: !lost && resolved === game.tiles.length };
		}

		function finish(d) {
			if (st.done || !(d.won || d.lost)) { return; }
			var y = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1);
			st.streak = st.last === dayKey(y) ? (st.streak || 0) + 1 : 1;
			st.played = (st.played || 0) + 1;
			st.wins = (st.wins || 0) + (d.won ? 1 : 0);
			st.last = key;
			st.done = true;
			st.won = d.won;
			save(st);
		}

		function shareText(d) {
			var rows = [];
			for (var r = 0; r < 8; r++) {
				var row = '';
				for (var c = 0; c < 2; c++) {
					var i = r * 2 + c, x = d.res[i];
					row += !x ? '⬛' : !x.ok ? '🟨' : x.call === 'f' ? '🚩' : '🟩';
				}
				rows.push(row);
			}
			return 'Scam Stopper #' + (num + 1) + ' 🛡️\n' +
				(d.won ? 'Found all ' + game.total : 'Found ' + d.found + ' of ' + game.total) + ' red flags, ' + d.strikes + (d.strikes === 1 ? ' strike' : ' strikes') + '\n' +
				rows.join('\n') + '\nclickwithconfidence.org';
		}

		function copy(text, done) {
			function fallback() {
				var ta = el('textarea');
				ta.value = text;
				ta.setAttribute('readonly', '');
				ta.style.cssText = 'position:fixed;left:-9999px;top:0;';
				document.body.appendChild(ta);
				ta.select();
				var ok = false;
				try { ok = document.execCommand('copy'); } catch (e) {}
				document.body.removeChild(ta);
				done(ok);
			}
			if (navigator.clipboard && navigator.clipboard.writeText) {
				navigator.clipboard.writeText(text).then(function () { done(true); }, fallback);
			} else { fallback(); }
		}

		function mark(call) {
			if (sel < 0) { return; }
			var d0 = derive();
			if (d0.lost || d0.won || d0.res[sel]) { return; }
			var t = game.tiles[sel];
			var ok = (call === 'f') === !!t.f;
			st.moves.push([sel, call]);
			var d = derive();
			if (ok) {
				note = call === 'f' ? 'Correct: that is a red flag.' : 'Correct: that piece is safe.';
			} else {
				note = 'Not quite: that piece is ' + (t.f ? 'a red flag' : 'safe') + '. Strike ' + d.strikes + ' of ' + MAX + '.';
			}
			focusIdx = sel;
			sel = -1;
			save(st);
			finish(d);
			paint(true);
		}

		function paint(fromMove) {
			var d = derive();
			var over = d.won || d.lost;
			body.innerHTML = '';

			/* How to play. Open on a first visit, closed after that. */
			var how = el('details', 'game__how');
			if (!st.played) { how.open = true; }
			how.appendChild(el('summary', '', 'How to play'));
			var ol = el('ol', 'game__steps');
			['Read the message below. Each piece is either a red flag or safe.',
				'Tap a piece, then press Safe or Red flag.',
				'A safe piece shows a number: how many red flags touch it, corners included.',
				'A wrong call costs a strike. Three strikes ends the game. There is one new game every day.'
			].forEach(function (s) { ol.appendChild(el('li', '', s)); });
			how.appendChild(ol);
			body.appendChild(how);

			/* Status. */
			var status = el('div', 'game__status');
			status.appendChild(el('span', 'game__meta', 'Game #' + (num + 1) + ' · ' + now.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })));
			var count = el('span', 'game__count');
			count.appendChild(document.createTextNode('Red flags found: '));
			count.appendChild(el('strong', '', d.found + ' of ' + game.total));
			status.appendChild(count);
			var left = MAX - d.strikes;
			var shields = el('span', 'game__strikes');
			shields.setAttribute('role', 'img');
			shields.setAttribute('aria-label', Math.max(0, left) + (left === 1 ? ' strike left' : ' strikes left'));
			for (var s = 0; s < MAX; s++) {
				var sh = el('span', 'game__shield' + (s < left ? '' : ' is-lost'));
				sh.innerHTML = ICON_SHIELD;
				shields.appendChild(sh);
			}
			status.appendChild(shields);
			body.appendChild(status);

			/* The message. */
			var msg = el('div', 'game__msg app app--' + game.kind);
			var chrome = CHROME[game.kind] || CHROME.email;
			var head = el('div', 'app__head');
			head.setAttribute('aria-hidden', 'true');
			head.innerHTML = chrome.head;
			msg.appendChild(head);
			var grid = el('div', 'game__grid');
			grid.setAttribute('role', 'group');
			grid.setAttribute('aria-label', 'Pieces of the message');
			var buttons = [];
			game.tiles.forEach(function (t, i) {
				var x = d.res[i];
				var show = x || d.lost;
				var b = el('button', 'tile tile--' + ROLE(i));
				b.type = 'button';
				if (i === 0) { b.setAttribute('data-initial', (t.t.replace(/[^A-Za-z]/g, '').charAt(0) || '?').toUpperCase()); }
				b.setAttribute('data-i', i);
				var state = '';
				if (x) {
					b.classList.add(t.f ? 'is-flag' : 'is-safe');
					if (!x.ok) { b.classList.add('is-miss'); }
					b.setAttribute('aria-disabled', 'true');
				} else if (d.lost) {
					b.classList.add(t.f ? 'is-flag' : 'is-safe', 'is-open');
					b.setAttribute('aria-disabled', 'true');
				} else if (d.won) {
					b.setAttribute('aria-disabled', 'true');
				}
				if (i === sel) { b.classList.add('is-selected'); b.setAttribute('aria-pressed', 'true'); }

				var top = el('span', 'tile__top');
				top.appendChild(el('span', 'tile__label', t.l || ''));
				if (show) {
					var badge = el('span', 'tile__badge');
					if (t.f) { badge.innerHTML = ICON_FLAG; } else { badge.textContent = t.c; }
					top.appendChild(badge);
				}
				b.appendChild(top);
				b.appendChild(el('span', 'tile__text', t.t));

				if (show) {
					state = t.f ? 'Red flag.' : 'Safe. Touches ' + t.c + (t.c === 1 ? ' red flag.' : ' red flags.');
					b.appendChild(el('span', 'sr-only', state));
					if (t.f) {
						var why = el('span', 'tile__why');
						why.appendChild(el('strong', '', 'Red flag: '));
						why.appendChild(document.createTextNode(t.w));
						b.appendChild(why);
					}
					if (x && !x.ok) { b.appendChild(el('span', 'tile__note', 'You said ' + (x.call === 'f' ? 'red flag' : 'safe') + '. That was a strike.')); }
					else if (x && x.auto) { b.appendChild(el('span', 'tile__note tile__note--soft', 'Cleared to start')); }
					else if (!x) { b.appendChild(el('span', 'tile__note tile__note--soft', 'Not marked')); }
				}
				grid.appendChild(b);
				buttons.push(b);
			});
			msg.appendChild(grid);
			if (chrome.foot) {
				var foot = el('div', 'app__foot');
				foot.setAttribute('aria-hidden', 'true');
				foot.innerHTML = chrome.foot;
				msg.appendChild(foot);
			}
			body.appendChild(msg);

			/* Safe / Red flag bar. */
			var bar, prompt, bSafe, bFlag;
			if (!over) {
				bar = el('div', 'game__bar');
				prompt = el('p', 'game__prompt');
				prompt.setAttribute('role', 'status');
				prompt.setAttribute('aria-live', 'polite');
				prompt.textContent = sel >= 0 ? 'Is this safe, or a red flag? “' + shorten(game.tiles[sel].t, 70) + '”' : (note || 'Tap a piece of the message to begin.');
				var row = el('div', 'game__btns');
				bSafe = el('button', 'gbtn gbtn--safe');
				bSafe.type = 'button';
				bSafe.innerHTML = ICON_CHECK;
				bSafe.appendChild(el('span', '', 'Safe'));
				bFlag = el('button', 'gbtn gbtn--flag');
				bFlag.type = 'button';
				bFlag.innerHTML = ICON_FLAG;
				bFlag.appendChild(el('span', '', 'Red flag'));
				bSafe.disabled = bFlag.disabled = sel < 0;
				row.appendChild(bSafe);
				row.appendChild(bFlag);
				bar.appendChild(prompt);
				bar.appendChild(row);
				body.appendChild(bar);
				bSafe.addEventListener('click', function () { mark('s'); });
				bFlag.addEventListener('click', function () { mark('f'); });
			}

			buttons.forEach(function (b) {
				b.addEventListener('click', function () {
					if (over || b.getAttribute('aria-disabled') === 'true') { return; }
					var i = +b.getAttribute('data-i');
					sel = sel === i ? -1 : i;
					note = '';
					focusIdx = i;
					paint();
				});
			});

			/* Result. */
			if (over) {
				var win = d.won;
				var res = el('div', 'game__result ' + (win ? 'is-win' : 'is-loss'));
				res.tabIndex = -1;
				res.appendChild(el('h3', 'game__verdict', win
					? (d.strikes ? 'You found all ' + game.total + ' red flags with ' + d.strikes + (d.strikes === 1 ? ' strike.' : ' strikes.') : 'Perfect! You found all ' + game.total + ' red flags with no strikes.')
					: 'Out of strikes. Here is what to look for.'));
				var tip = el('p', 'game__tip');
				tip.appendChild(el('strong', '', 'What to do: '));
				tip.appendChild(document.createTextNode(game.tip));
				res.appendChild(tip);

				var actions = el('div', 'game__actions');
				var share = el('button', 'btn btn--primary');
				share.type = 'button';
				share.appendChild(el('span', '', 'Copy my result'));
				var shared = el('span', 'game__shared');
				shared.setAttribute('role', 'status');
				actions.appendChild(share);
				actions.appendChild(shared);
				res.appendChild(actions);
				share.addEventListener('click', function () {
					copy(shareText(d), function (ok) { shared.textContent = ok ? 'Copied. Paste it anywhere to share.' : 'Could not copy. Select the result and copy it yourself.'; });
				});

				var line = 'Come back in ' + untilTomorrow(new Date()) + ' for a new game.';
				if (st.played) { line += ' You have played ' + st.played + (st.played === 1 ? ' day' : ' days') + ' so far' + (st.streak > 1 ? ', ' + st.streak + ' in a row' : '') + '' + (st.wins ? ', and cleared the whole message ' + st.wins + (st.wins === 1 ? ' time.' : ' times.') : '.'); }
				res.appendChild(el('p', 'game__next', line));
				body.appendChild(res);

				if (fromMove) { res.focus({ preventScroll: true }); res.scrollIntoView({ block: 'nearest', behavior: 'smooth' }); }
			} else if (focusIdx >= 0) {
				buttons[focusIdx].focus({ preventScroll: true });
			}
			focusIdx = -1;
			root.classList.add('is-ready');
		}

		/* S and F work as shortcuts once a piece is selected. */
		if (!root.hasAttribute('data-keys')) {
			root.setAttribute('data-keys', '1');
			root.addEventListener('keydown', function (e) {
				if (e.ctrlKey || e.metaKey || e.altKey) { return; }
				var k = (e.key || '').toLowerCase();
				if (k === 's') { render.mark && render.mark('s'); }
				if (k === 'f') { render.mark && render.mark('f'); }
			});
		}
		render.mark = mark;

		paint();
		finish(derive());

		/* If the tab stays open past midnight, move on to the new game. */
		var tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 5);
		clearTimeout(render.timer);
		render.timer = setTimeout(render, Math.min(tomorrow - now, 2147483000));
	}

	render();
})();
