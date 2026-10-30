/*
 * Click With Confidence — "Scam Stopper" question of the day (home page).
 *
 * One scenario per day, taken from js/scam-stopper-data.js (365 of them, from
 * the start date there). A visitor gets one answer per day: the choice is kept
 * in this browser's localStorage, so reloading the page shows the same result.
 * The day changes at the visitor's local midnight.
 */
(function () {
	'use strict';

	var root = document.querySelector('[data-quiz]');
	var data = window.CWC_QUIZ;
	if (!root || !data || !data.questions || !data.questions.length) { return; }

	var body = root.querySelector('.quiz__body');
	var dateEl = root.querySelector('.quiz__date');
	var KEY = 'cwc-quiz';
	var LETTERS = ['A', 'B', 'C', 'D'];

	function pad(n) { return (n < 10 ? '0' : '') + n; }
	function dayKey(d) { return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()); }

	/* Whole days since the start date, counted on calendar dates so daylight saving cannot shift it. */
	function dayIndex(d) {
		var today = Date.UTC(d.getFullYear(), d.getMonth(), d.getDate());
		var start = Date.UTC(data.start[0], data.start[1] - 1, data.start[2]);
		var n = Math.floor((today - start) / 86400000);
		var len = data.questions.length;
		return ((n % len) + len) % len;
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

	/* Put the right answer in a different slot each day; the wrong ones keep their written order. */
	function choicesFor(idx) {
		var q = data.questions[idx];
		var slot = idx % 4;
		var wrong = q.slice(2, 5);
		var out = [], w = 0;
		for (var i = 0; i < 4; i++) { out.push(i === slot ? { text: q[1], ok: true } : { text: wrong[w++], ok: false }); }
		return out;
	}

	function untilTomorrow(now) {
		var next = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
		var mins = Math.max(1, Math.round((next - now) / 60000));
		var h = Math.floor(mins / 60), m = mins % 60;
		return (h ? h + (h === 1 ? ' hour' : ' hours') + (m ? ' ' : '') : '') + (m || !h ? m + (m === 1 ? ' minute' : ' minutes') : '');
	}

	function render() {
		var now = new Date();
		var key = dayKey(now);
		var idx = dayIndex(now);
		var q = data.questions[idx];
		var choices = choicesFor(idx);
		var state = load();
		var answered = state.day === key && typeof state.pick === 'number';

		body.innerHTML = '';
		dateEl.textContent = now.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' });

		body.appendChild(el('p', 'quiz__scenario', q[0]));

		var list = el('div', 'quiz__choices');
		list.setAttribute('role', 'group');
		list.setAttribute('aria-label', 'Answer choices');
		var buttons = choices.map(function (c, i) {
			var b = el('button', 'quiz__choice');
			b.type = 'button';
			b.appendChild(el('span', 'quiz__letter', LETTERS[i]));
			b.appendChild(el('span', 'quiz__text', c.text));
			list.appendChild(b);
			return b;
		});
		body.appendChild(list);

		var result = el('div', 'quiz__result');
		result.setAttribute('role', 'status');
		result.setAttribute('aria-live', 'polite');
		body.appendChild(result);

		function showResult(pick) {
			var right = choices[pick].ok;
			var correctIdx = 0;
			choices.forEach(function (c, i) { if (c.ok) { correctIdx = i; } });
			buttons.forEach(function (b, i) {
				b.disabled = true;
				if (i === correctIdx) { b.classList.add('is-correct'); b.appendChild(el('span', 'quiz__mark', right && i === pick ? '✓ Your answer' : '✓ Best answer')); }
				else if (i === pick) { b.classList.add('is-wrong'); b.appendChild(el('span', 'quiz__mark', '✗ Your answer')); }
				else { b.classList.add('is-dim'); }
			});
			result.innerHTML = '';
			result.className = 'quiz__result is-shown ' + (right ? 'is-right' : 'is-miss');
			result.appendChild(el('p', 'quiz__verdict', right ? 'Correct — nicely spotted!' : 'Not quite — the best answer is ' + LETTERS[correctIdx] + '.'));
			result.appendChild(el('p', 'quiz__why', q[5]));
			var s = load();
			var played = s.played || 0;
			var line = 'Come back in ' + untilTomorrow(new Date()) + ' for a new question.';
			if (played > 0) { line += ' You have answered ' + played + (played === 1 ? ' day' : ' days') + ' so far' + ((s.streak || 0) > 1 ? ', ' + s.streak + ' in a row' : '') + ', and got ' + (s.correct || 0) + ' right.'; }
			result.appendChild(el('p', 'quiz__next', line));
		}

		if (answered) {
			showResult(state.pick);
		} else {
			buttons.forEach(function (b, i) {
				b.addEventListener('click', function () {
					var s = load();
					if (s.day === key) { render(); return; }
					var y = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1);
					s.streak = s.last === dayKey(y) ? (s.streak || 0) + 1 : 1;
					s.played = (s.played || 0) + 1;
					s.correct = (s.correct || 0) + (choices[i].ok ? 1 : 0);
					s.day = key;
					s.pick = i;
					s.last = key;
					save(s);
					showResult(i);
					result.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
				});
			});
		}

		root.classList.add('is-ready');

		/* If the tab stays open past midnight, move on to the new question. */
		var tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 5);
		clearTimeout(render.timer);
		render.timer = setTimeout(render, Math.min(tomorrow - now, 2147483000));
	}

	render();
})();
