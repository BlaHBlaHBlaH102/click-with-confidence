<?php
// Privacy Policy — route: /privacy-policy (reachable directly; intentionally not in the main menu)
require_once dirname(__FILE__) . '/cwc.inc.php';
cwc_page_start(array(
	'title'       => 'Click With Confidence',
	'description' => 'Privacy Policy',
	'route'       => 'privacy-policy',
	'active'      => '',
	'bodyClass'   => 'page-privacy',
));
?>

<section class="page-hero page-hero--compact">
	<canvas class="particles" aria-hidden="true"></canvas>
	<div class="hero__orb hero__orb--a" aria-hidden="true"></div>
	<div class="container">
		<h1 class="display page-hero__title reveal">PRIVACY POLICY</h1>
	</div>
</section>

<section class="section section--tight">
	<div class="container container--narrow">
		<div class="doc">
			<div class="doc__meta">
				<p class="doc__kicker">PRIVACY POLICY — CLICK WITH CONFIDENCE BROWSER EXTENSION</p>
				<p>Last updated: May 25, 2026</p>
				<p>Effective date: May 25, 2026</p>
			</div>
			<h2 class="doc__heading">1. INTRODUCTION AND IDENTITY</h2>
			<p>Click With Confidence ("we," "us," "our") is a nonprofit organization operating the Click With Confidence browser extension ("the Extension"). Our mission is to protect seniors and vulnerable individuals from email phishing scams and fraud.</p>
			<p>Website: clickwithconfidence.org</p>
			<p>Contact: <a href="mailto:info@clickwithconfidence.org">info@clickwithconfidence.org</a></p>
			<p>Extension name: Click With Confidence</p>
			<p>Available on: Google Chrome Web Store</p>
			<p>This Privacy Policy explains exactly what data our Extension accesses, what we do with it, what we do not do with it, and what rights you have. By installing or using the Extension, you agree to this policy.</p>
			<h2 class="doc__heading">2. SCOPE OF THIS POLICY</h2>
			<p>This policy applies to:</p>
			<p>The Click With Confidence Chrome browser extension</p>
			<p>The backend scanning service operated at click-with-confidence-api.onrender.com</p>
			<p>Any interaction between your browser and our servers</p>
			<p>This policy does not apply to third-party websites you may visit, including Gmail, Outlook, or Yahoo Mail, which have their own privacy policies.</p>
			<h2 class="doc__heading">3. WHAT PERMISSIONS WE REQUEST AND WHY</h2>
			<p>Our Extension requests the following Chrome permissions. We explain the exact reason for each:</p>
			<p>activeTab — Required to read the content of the email you currently have open, but only when you click Scan or when automatic mode is enabled. We never access tabs you are not actively using.</p>
			<p>storage — Required to save your preferences locally on your device, specifically your chosen mode (Manual or Automatic) and your alert threshold setting. This data never leaves your device.</p>
			<p>scripting — Required to inject our content reader script into Gmail, Outlook, and Yahoo Mail pages so we can extract the email text you want scanned.</p>
			<p>notifications — Required to display a pop-up alert on your screen when automatic mode detects a suspicious email above your chosen threshold.</p>
			<p>host permissions for mail.google.com, outlook.live.com, outlook.office.com, outlook.office365.com, mail.yahoo.com — Required to allow our content script to run on these email provider pages. We only read email content when explicitly triggered by you or by automatic mode. We do not read, access, or transmit any other data from these pages.</p>
			<p>We do not request access to your browsing history, bookmarks, passwords, or any other browser data.</p>
			<h2 class="doc__heading">4. WHAT DATA WE ACCESS</h2>
			<p>When you scan an email, our Extension reads the following from the currently open email only:</p>
			<p>The email body text</p>
			<p>The email subject line</p>
			<p>The sender's email address</p>
			<p>We access this data only at the moment of scanning. We do not access your inbox list, other emails, attachments, contacts, calendar, or any other information.</p>
			<p>We do not collect:</p>
			<p>Your name</p>
			<p>Your personal email address</p>
			<p>Your Google, Microsoft, or Yahoo account information</p>
			<p>Your login credentials or passwords</p>
			<p>Your IP address</p>
			<p>Your location</p>
			<p>Any payment information</p>
			<p>Any browsing history outside of email provider pages</p>
			<p>No account creation or sign-in of any kind is required to use our Extension.</p>
			<h2 class="doc__heading">5. HOW WE USE YOUR DATA — LIMITED USE POLICY</h2>
			<p>We strictly comply with the Chrome Web Store User Data Policy, including the Limited Use requirements.</p>
			<p>The email content accessed by our Extension is used for one purpose and one purpose only: to analyze whether the email you are currently viewing appears to be a phishing attempt or scam, and to return a risk score and plain-English explanation to you.</p>
			<p>We do not:</p>
			<p>Store or log your email content on our servers</p>
			<p>Share your email content with any third party except as described in Section 6</p>
			<p>Sell your data under any circumstances</p>
			<p>Use your data for advertising or marketing purposes</p>
			<p>Use your data to build user profiles</p>
			<p>Transfer your data to data brokers</p>
			<p>Use your data for any purpose unrelated to providing the email scanning feature</p>
			<p>Allow humans to read your email content except in aggregated, anonymized form for security research with your explicit consent</p>
			<p>Email content is transmitted to our server over an encrypted HTTPS connection, analyzed immediately, and discarded. It is never written to a database or log file.</p>
			<h2 class="doc__heading">6. THIRD PARTY SERVICES</h2>
			<h3 class="doc__subheading">Google Gemini API</h3>
			<p>Our scanning service uses the Google Gemini API to perform AI-powered phishing analysis. When you scan an email, the email text, subject line, and sender address are transmitted to Google's Gemini API for processing.</p>
			<p>Under Google's free-tier API terms, data submitted through the free tier may be used by Google to improve their AI models. We have no control over Google's handling of this data once it is transmitted to their API.</p>
			<p>Google's Privacy Policy: policies.google.com/privacy Google's API Terms of Service: ai.google.dev/terms</p>
			<p>We are working toward upgrading to a paid API tier, under which Google's data training clause does not apply. We will update this policy when that transition is complete.</p>
			<h3 class="doc__subheading">Render (Backend Hosting)</h3>
			<p>Our backend server is hosted on Render (render.com). Render may retain standard server access logs including timestamps and HTTP status codes. These logs do not contain email content. Render's privacy policy can be found at render.com/privacy.</p>
			<h2 class="doc__heading">7. DATA RETENTION</h2>
			<p>We retain no email content whatsoever. The moment a scan is complete and the result is returned to your browser, the email text is gone from our systems.</p>
			<p>The only data stored is:</p>
			<p>On your device only: your mode preference and alert threshold, stored via Chrome's local storage API</p>
			<p>On Render's servers: standard HTTP access logs containing timestamps and status codes only, no email content</p>
			<h2 class="doc__heading">8. DATA SECURITY</h2>
			<p>All data transmitted between your browser and our server is encrypted using HTTPS/TLS. We do not store email content in any database, file, or log. Our server does not write email content to disk at any point during processing.</p>
			<h2 class="doc__heading">9. CHILDREN'S PRIVACY</h2>
			<p>Our Extension is not directed at children under the age of 13. We do not knowingly collect any personal information from children under 13. If you believe a child has used our Extension and you have concerns, please contact us at info@clickwithconfidence.org.</p>
			<h2 class="doc__heading">10. YOUR RIGHTS AND CHOICES</h2>
			<p>Because we do not store any personal data tied to your identity, most traditional data rights (access, deletion, portability) are not applicable — there is simply nothing stored about you to retrieve or delete.</p>
			<p>You may at any time:</p>
			<p>Uninstall the Extension, which removes all locally stored preferences from your device</p>
			<p>Switch from Automatic mode to Manual mode to have full control over when any email content is transmitted</p>
			<p>Contact us at info@clickwithconfidence.org with any privacy concern and we will respond within 5 business days</p>
			<p>If you are located in the European Union, United Kingdom, or California, you may have additional rights under GDPR, UK GDPR, or CCPA respectively. Because we do not store personal data, these rights are satisfied by design. For any questions, contact info@clickwithconfidence.org.</p>
			<h2 class="doc__heading">11. COMPLIANCE WITH CHROME WEB STORE POLICIES</h2>
			<p>We certify the following in accordance with Google's Chrome Web Store Developer Program Policies:</p>
			<p>We only request permissions that are necessary for our Extension's core functionality</p>
			<p>We do not use email content for any purpose other than providing the phishing detection feature to the user</p>
			<p>We do not sell user data</p>
			<p>We do not use user data for advertising</p>
			<p>We comply with the Limited Use Policy for data obtained through Chrome extension APIs</p>
			<p>We provide this prominent privacy policy disclosing all data collection and use</p>
			<h2 class="doc__heading">12. CHANGES TO THIS POLICY</h2>
			<p>If we make material changes to this Privacy Policy, we will update the "Last updated" date at the top of this page and, where appropriate, notify users through the Extension itself. Continued use of the Extension after changes are posted constitutes acceptance of the updated policy.</p>
			<p>We encourage you to review this policy periodically.</p>
			<h2 class="doc__heading">13. CONTACT US</h2>
			<p>If you have any questions, concerns, or requests regarding this Privacy Policy or our data practices, please contact us:</p>
			<p>Click With Confidence Email: <a href="mailto:info@clickwithconfidence.org">info@clickwithconfidence.org</a> Website: <a href="privacy-policy">clickwithconfidence.org</a></p>
			<p>We are committed to resolving any privacy concerns promptly and transparently.</p>
			<h2 class="doc__heading">14. GOVERNING LAW</h2>
			<p>This Privacy Policy is governed by the laws of the United States. Any disputes arising under this policy shall be resolved in accordance with applicable federal and state law.</p>
			<p>Click With Confidence is a nonprofit organization. We are not affiliated with, endorsed by, or sponsored by Google, Gmail, Microsoft, Outlook, Yahoo, or any other third-party service mentioned in this policy.</p>
		</div>
	</div>
</section>

<?php cwc_page_end();
