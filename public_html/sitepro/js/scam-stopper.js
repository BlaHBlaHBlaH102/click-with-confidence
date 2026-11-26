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
			var msg = el('div', 'game__msg');
			var head = el('div', 'game__msghead');
			head.appendChild(el('span', 'game__msgdots'));
			head.appendChild(el('span', '', "Today's message · " + game.kindName));
			msg.appendChild(head);
			var grid = el('div', 'game__grid');
			grid.setAttribute('role', 'group');
			grid.setAttribute('aria-label', 'Pieces of the message');
			var buttons = [];
			game.tiles.forEach(function (t, i) {
				var x = d.res[i];
				var show = x || d.lost;
				var b = el('button', 'tile');
				b.type = 'button';
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
