/*
 * Click With Confidence — "bring us to your organization" form (home page).
 *
 * Sends the form to /Contact in the background and shows a thank-you in place.
 * Without JavaScript the form still posts normally and /Contact shows the result.
 */
(function () {
	'use strict';

	var form = document.querySelector('[data-contact-form]');
	if (!form) { return; }

	var status = form.querySelector('[data-contact-status]');
	var done = document.querySelector('[data-contact-done]');
	var button = form.querySelector('button[type="submit"]');
	var label = button.querySelector('span');
	var sending = false;

	function say(text, bad) {
		status.textContent = text;
		status.classList.toggle('is-error', !!bad);
	}

	/* Plain-language messages instead of the browser's own. */
	function problems() {
		var list = [];
		['name', 'org', 'email'].forEach(function (n) {
			var el = form.elements[n];
			var v = (el.value || '').trim();
			var bad = !v || (n === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v));
			el.setAttribute('aria-invalid', bad ? 'true' : 'false');
			if (bad) {
				list.push({ el: el, text: n === 'name' ? 'Please tell us your name.' : n === 'org' ? 'Please tell us the name of your senior center or organization.' : 'Please enter an email address we can reach you at.' });
			}
		});
		return list;
	}

	form.addEventListener('input', function (e) {
		if (e.target.getAttribute('aria-invalid') === 'true') { e.target.setAttribute('aria-invalid', 'false'); }
	});

	form.addEventListener('submit', function (e) {
		if (!window.fetch || !window.FormData) { return; } // old browser: let the form post normally
		e.preventDefault();
		if (sending) { return; }

		var bad = problems();
		if (bad.length) {
			say(bad[0].text, true);
			bad[0].el.focus();
			return;
		}

		sending = true;
		button.disabled = true;
		label.textContent = 'Sending…';
		say('');

		fetch(form.getAttribute('action'), {
			method: 'POST',
			body: new FormData(form),
			headers: { 'X-Requested-With': 'fetch', 'Accept': 'application/json' },
			credentials: 'same-origin'
		}).then(function (res) {
			return res.json().catch(function () { return { ok: false, errors: [] }; });
		}).then(function (data) {
			if (data && data.ok) {
				form.hidden = true;
				done.hidden = false;
				done.focus();
				done.scrollIntoView({ block: 'center', behavior: 'smooth' });
			} else {
				say((data && data.errors && data.errors[0]) || 'Sorry, something went wrong. Please email info@clickwithconfidence.org.', true);
			}
		}).catch(function () {
			say('We could not reach the server. Please check your connection or email info@clickwithconfidence.org.', true);
		}).then(function () {
			sending = false;
			button.disabled = false;
			label.textContent = 'Send request';
		});
	});
})();
