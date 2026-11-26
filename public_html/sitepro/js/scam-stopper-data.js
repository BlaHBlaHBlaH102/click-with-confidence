/*
 * Click With Confidence - "Scam Stopper" daily game: content and game builder.
 *
 * Every day has one game: a fake scam message cut into 16 pieces (two columns by
 * eight rows). Each piece is either a red flag or safe. make(n) builds game number
 * n (0 = the first day) from the pools below with a seeded random generator, so
 * every visitor gets the same game on the same day, and the games never run out.
 * Games 0-364 are the first year and are checked by the tests described in the README.
 *
 * To add a scam type or a line, edit TYPES (or the shared pools) below.
 * Text tokens like {name} or {phone} are filled in per game (see makeVars).
 *
 * Tile layout (index): 0 sender, 1 subject, 2 greeting, 3 opening line,
 * 4-13 body (shuffled), 14 link or contact, 15 sign-off.
 */
(function (root) {
	'use strict';

	/* Reasons shown to the player. Reused so the wording stays consistent. */
	var W = {
		urg: "Scammers rush you so you won't stop to think or ask anyone.",
		gift: 'Real companies and agencies never ask for payment in gift cards.',
		wire: 'Wire transfers, cash apps and crypto are hard to undo, which is why scammers ask for them.',
		secret: 'Scammers keep you quiet so no one can warn you.',
		threat: 'Threats are meant to scare you into acting before you think.',
		info: 'Never give personal or account details to someone who contacted you first.',
		pw: 'No honest company or bank will ask for your password or PIN.',
		code: 'A code sent to you is the key to your account. Sharing it hands the account over.',
		spoof: 'Names and caller IDs can be faked, so they prove nothing.',
		domain: 'A look-alike web address is a classic trick. Real organizations use their own exact address.',
		gov: 'Government agencies use .gov addresses, never free email accounts.',
		link: 'Links in unexpected messages can lead to fake sites. Go to the real site yourself.',
		phone: "Don't call a number from an unexpected message. Look up the real number yourself.",
		remote: 'Never let someone who contacted you take control of your computer.',
		greet: 'A generic greeting is a sign of a mass message. Real companies that know you use your name.',
		caps: 'Shouting in capitals and extra exclamation marks are common in scam messages.',
		gram: 'Odd wording and typos often show up in mass-produced scam messages.',
		fee: "Real prizes, grants and refunds are free. If you have to pay a fee to get money, it's a scam.",
		good: 'If it sounds too good to be true, it is. Nothing is guaranteed and nothing is risk-free.',
		short: 'Shortened links hide where they really lead.',
		stay: 'Scammers keep you on the line so you cannot check with anyone.',
		avoid: 'Scammers steer you away from the people and places who could help you spot the scam.',
		vague: 'A vague title or team name makes it sound official without anything you can check.',
		badge: 'A badge number or title sounds official, but you cannot check it.',
		cash: 'Demanding cash up front is a warning sign.',
		love: 'Strong feelings very fast, from someone you have never met, is a classic romance-scam move.',
		video: 'Someone who never appears on a live video call may not be who they say they are.',
		fake: 'A scammer sends a fake check, then asks for real money back before the bank finds the fake.',
		lic: 'Honest advisors and contractors are licensed, and you can check that with the state.'
	};

	var KINDS = {
		email: { name: 'Email', l: ['From', 'Subject', 'Link or contact', 'Sign-off'] },
		text: { name: 'Text message', l: ['From', 'Starts with', 'Link or contact', 'Sign-off'] },
		voicemail: { name: 'Voicemail', l: ['Caller ID', 'Opens with', 'Asks you to', 'Sign-off'] },
		popup: { name: 'Pop-up on a website', l: ['Website', 'Headline', 'Button', 'Footer'] },
		dm: { name: 'Online chat message', l: ['From', 'Opens with', 'Link or contact', 'Sign-off'] }
	};

	/* ---------- Shared pools ---------- */

	var NAMES = ['Margaret', 'Robert', 'Linda', 'James', 'Patricia', 'Harold', 'Dorothy', 'George', 'Barbara', 'Walter', 'Helen', 'Frank', 'Ruth', 'Arthur', 'Joan', 'Eugene', 'Shirley', 'Raymond', 'Betty', 'Lawrence', 'Evelyn', 'Donald', 'Carol', 'Leonard', 'Nancy', 'Howard', 'Janet', 'Charles'];

	var GREET_SAFE = ['Hello {name},', 'Hi {name},', 'Dear {name},', 'Good morning {name},', 'Good afternoon {name},'];
	var GREET_FLAG = [['Dear Valued Customer,', W.greet], ['Dear Sir or Madam,', W.greet], ['Dear Account Holder,', W.greet], ['Dear Customer,', W.greet], ['Attention: Dear User!!', W.greet]];

	/* Harmless filler lines that fit any message. */
	var GS = [
		'Thank you for your time and patience.',
		'We appreciate your business.',
		'Please review the details below.',
		'Your reference number is {ref}.',
		'This notice is for your information.',
		'We are here to help with any questions.',
		'Please keep this message for your records.',
		'Our team works Monday to Friday.',
		'This message was sent on {date}.',
		'Thank you for choosing us.',
		'We value your trust.',
		'Details are listed below.',
		'This message is about your account.',
		'Have a wonderful day.'
	];

	/* Filler for chatty messages (texts, chats, personal emails). */
	var GS_CASUAL = ['Please let me know.', 'Thank you for reading this.', 'I hope this reaches you.', 'I appreciate your time.', 'Let me know if you have questions.', 'I will explain more soon.', 'Thanks for your patience.', 'I hope you are well.'];

	/* Shared red flags that fit any message. c = category (at most one per game). */
	var GF = [
		{ c: 'u', t: 'You must respond within {hrs} hours.', w: W.urg },
		{ c: 'u', t: 'Act now before it is too late!', w: W.urg },
		{ c: 'u', t: 'This is your FINAL notice.', w: W.urg },
		{ c: 'u', t: 'Please respond right away to avoid problems.', w: W.urg },
		{ c: 's', t: 'Do not tell anyone about this, not even your family.', w: W.secret },
		{ c: 's', t: 'Please keep this between us for now.', w: W.secret },
		{ c: 's', t: 'This matter is confidential. Do not discuss it with others.', w: W.secret },
		{ c: 'p', t: 'Pay using gift cards from any store.', w: W.gift },
		{ c: 'p', t: 'Payment must be made by wire transfer.', w: W.wire },
		{ c: 'p', t: 'We can only accept payment in Bitcoin.', w: W.wire },
		{ c: 'p', t: 'Send the money today through a cash app.', w: W.wire },
		{ c: 't', t: 'Otherwise, your account will be closed for good.', w: W.threat },
		{ c: 't', t: 'Failure to comply may lead to legal action.', w: W.threat },
		{ c: 't', t: 'Your funds will be frozen if you ignore this.', w: W.threat },
		{ c: 'i', t: 'Please confirm your Social Security number.', w: W.info },
		{ c: 'i', t: 'We will need your full card number and security code.', w: W.info },
		{ c: 'i', t: 'Verify your password to continue.', w: W.pw },
		{ c: 'i', t: 'Send us a photo of your driver license.', w: W.info },
		{ c: 'g', t: 'Your account have been flagged for review!!', w: W.gram },
		{ c: 'g', t: 'Please to respond this message with urgency.', w: W.gram },
		{ c: 'y', t: 'Guaranteed results with zero risk.', w: W.good },
		{ c: 'y', t: 'This special offer was chosen just for you!', w: W.good }
	];

	/*
	 * Scam types. Fields:
	 *   kind    one of KINDS
	 *   vars    values for tokens that differ by type
	 *   from    [text, isFlag, why]   subj [text, isFlag, why]   link [text, isFlag, why]   sign [text, isFlag, why]
	 *   open    safe opening lines    safe  safe lines
	 *   flag    [text, why]           tip   what to do (shown after the game)
	 *   greet / greetF  optional personal greetings; ng = never use a generic (flagged) greeting
	 */
	var TYPES = [

		{ id: 'tech-support', kind: 'popup', gc: 'u', gs: 'none', ng: 1,
			vars: { amt: ['199', '299', '349', '499'], mins: ['10', '15', '30'] },
			greet: ['System notice:', 'Device status:', 'Notice for this computer:'],
			greetF: [['Dear User, WARNING!!', W.caps]],
			from: [['secure-windows-help.net', 1, W.domain], ['support-alert-center.com', 1, W.domain], ['Windows Defender Security Center', 1, 'A web page cannot scan your computer. It only borrows an official name.']],
			subj: [['WARNING: Your computer is infected!', 1, 'A website cannot tell if your computer has a virus. The fake alarm is the scam.'], ['Security Alert: 3 viruses found', 1, 'A website cannot tell if your computer has a virus. The fake alarm is the scam.'], ['Important notice about your device', 0, '']],
			open: ['We detected unusual activity on this device.', 'A problem was found on this computer.', 'Your system may be at risk.'],
			safe: ['Error code: DLL-0x8007.', 'Your files and photos could be affected.', 'Several programs are running slowly.', 'Support agents are available now.', 'Reference ID: {ref}.', 'Last scan: today at {time}.', 'Your browser version is out of date.'],
			flag: [['Call our certified technician at {phone} now.', 'Real companies do not put phone numbers in pop-up alerts.'], ['Do not restart or shut down your computer.', 'Telling you not to close the page keeps you scared and trapped.'], ['A technician will need remote access to fix this.', W.remote], ['The repair fee is ${amt}, payable by gift card.', W.gift], ['Your bank passwords may be stolen if you wait.', W.threat], ['Your computer will be locked in {mins} minutes.', 'A countdown timer is pressure, not security.'], ['This alert cannot be closed. Call immediately.', W.urg]],
			link: [['Button: Call Now {phone}', 1, W.phone], ['Button: Fix My Computer Now', 1, 'Clicking can install harmful software.']],
			sign: [['Microsoft Technical Department', 1, W.vague], ['Windows Support Team', 1, W.vague], ['Error ID: {ref}', 0, '']],
			tip: "Close the tab, or hold the power button if it will not close. Real companies never show a phone number in a pop-up. Never call it or let a stranger control your computer." },

		{ id: 'grandparent', kind: 'text', gc: '-', gs: 'none', ng: 1,
			vars: { amt: ['2,500', '3,800', '4,500', '6,000'] },
			greet: ['Hi {gp}!', '{gp}? It is me.', 'Hi {gp}, are you there?'],
			from: [['{cell} (a number you do not know)', 1, 'A grandchild texting from an unknown number should be checked before anything else.'], ['{cell}, saved under no name', 1, 'A grandchild texting from an unknown number should be checked before anything else.'], ['A new number, not saved in your phone', 1, 'A grandchild texting from an unknown number should be checked before anything else.']],
			subj: [['{gp} it is me, I am in trouble', 1, "Scammers say 'it's me' so you'll supply the name for them."], ['Hi {gp}, I got a new number', 1, "'New number' explains away why you do not recognize it."], ['Hi {gp}, are you there?', 0, '']],
			open: ['I was in a car accident and I am a little hurt.', 'I have been arrested and need your help.', 'I am stuck in another country and lost my wallet.'],
			safe: ['My phone is broken, so I am using a friend\'s.', 'I am okay, but I am really scared.', 'The lawyer says I need to pay bail.', 'I cannot talk long.', 'I feel terrible asking you.', 'Please, I need your help.', 'Everything happened so fast.', 'I do not have my wallet with me.', 'I will explain everything later.'],
			flag: [["Please do not tell Mom or Dad, they will be so upset.", W.secret], ['I need ${amt} sent today for bail.', 'A rushed request for money from a relative should always be checked first.'], ['Buy gift cards and text me the numbers.', W.gift], ['You can wire it to my lawyer, he will call you.', W.wire], ['Do not call me, my phone is about to die.', 'Scammers avoid a call because you would hear it is not your grandchild.'], ['Just send it fast, I am so scared.', W.urg], ['A man named Mr. {agent} will come to pick up cash.', 'A courier collecting cash from your home is a known scam.']],
			link: [['Pay here: bit.ly/help-{n}', 1, W.short], ['Reply YES and I will send the details', 0, '']],
			sign: [['Your favorite grandchild', 1, 'Scammers stay vague so you will fill in a name.'], ['Love you!!', 0, ''], ['Thank you so much', 0, '']],
			tip: "Stop texting and call your grandchild, or their parents, on the number you already have. Agree on a family code word that only real family would know." },

		{ id: 'irs', kind: 'email', gc: 'ustpi', gs: 'formal',
			vars: { amt: ['1,840', '2,315', '3,490', '4,260'], yr: ['2023', '2024', '2025'] },
			from: [['IRS Tax Refunds <refund@irs-gov-claims.com>', 1, W.gov], ['Internal Revenue Service <noreply@irs-taxdesk.net>', 1, W.gov], ['tax.compliance.dept@gmail.com', 1, W.gov]],
			subj: [['FINAL NOTICE: Unpaid taxes, legal action pending', 1, W.caps], ['Your tax refund of ${amt} is waiting', 1, 'A surprise refund email is bait. The IRS contacts you by mail first.'], ['Tax account notice', 0, '']],
			open: ['Our records show an unpaid balance on your {yr} tax return.', 'We are writing about a problem with your {yr} tax return.', 'A review of your account found a balance due.'],
			safe: ['The amount owed is ${amt}.', 'Your case number is {ref}.', 'Interest and penalties may apply.', 'Please keep this notice for your records.', 'This notice concerns tax year {yr}.', 'You can review your balance in your online account.'],
			flag: [['Pay immediately with gift cards to avoid arrest.', W.gift], ['A warrant will be issued if you do not call within {hrs} hours.', 'The IRS does not threaten arrest by email.'], ['Pay by wire transfer or prepaid cards only.', W.wire], ['Do not discuss this case with your accountant.', W.secret], ['Confirm your Social Security number to release your refund.', W.info], ['Your assets will be seized today.', W.threat]],
			link: [['Click here to pay: irs-payments-secure.com', 1, W.domain], ['Call Agent {agent} at {phone}', 1, W.phone]],
			sign: [['Officer {agent}, Badge #{n}', 1, W.badge], ['IRS Enforcement Division', 1, W.vague], ['Taxpayer Services', 0, '']],
			tip: "The IRS first writes to you by mail and never demands gift cards, wires or instant payment. Do not click. Look up the real number at irs.gov." },

		{ id: 'social-security', kind: 'voicemail', gc: 'ust', gs: 'none', ng: 1,
			vars: {},
			greet: ['Hello, this message is for {name}.', 'Good afternoon, this is a message for {name}.', 'Hello, I am calling for {name}.'],
			greetF: [['This message is for the account holder.', W.greet], ['Hello, this is an important message for the customer.', W.greet]],
			from: [['Caller ID shows: Social Security Administration', 1, W.spoof], ['Caller ID shows a real government number', 1, 'Scammers copy real numbers to look official. This is called spoofing.'], ['Caller ID: Unknown', 1, W.spoof]],
			subj: [['This is an urgent message from the Social Security office.', 1, 'Real agencies do not leave urgent threatening voicemails.'], ['This is Officer {agent} about your Social Security number.', 1, W.badge], ['This message concerns your Social Security account.', 0, '']],
			open: ['Your Social Security number has been linked to suspicious activity.', 'A problem was found with your Social Security account.', 'Several accounts were opened in your name.'],
			safe: ['This message is about case number {ref}.', 'We have tried to reach you before.', 'Your benefits may be affected.', 'Please listen carefully.', 'This is the second time we are calling.', 'Your file shows a recent review.', 'Our office hours are on weekdays.', 'We are calling from the main office.'],
			flag: [['Your number will be suspended in {hrs} hours.', "A Social Security number cannot be 'suspended'. That is a scare tactic."], ['Press 1 now to speak to an agent.', 'Pressing buttons on a robocall connects you to the scammer.'], ['Do not discuss this call with anyone.', W.secret], ['You will need to confirm your Social Security number.', W.info], ['To protect your money, we will tell you where to move it.', 'No agency will ever ask you to move your money.'], ['A warrant is being issued in your name.', W.threat], ['Do not hang up the phone.', W.stay]],
			link: [['Call back at {phone}', 1, W.phone], ['Press 1 to speak with an agent', 1, 'Pressing buttons on a robocall connects you to the scammer.']],
			sign: [['Thank you, Officer {agent}', 1, W.badge], ['Social Security Department', 1, W.vague], ['Goodbye.', 0, '']],
			tip: "Social Security will not threaten you or suspend your number. Hang up, then call the number on ssa.gov yourself if you are worried." },

		{ id: 'medicare', kind: 'text', gc: 'usi', gs: 'formal',
			vars: {},
			from: [['Medicare Benefits (from {cell})', 1, 'Medicare does not text you first, and the sender name can be faked.'], ['{cell}', 1, 'Medicare does not text you from a personal-looking number.'], ['Benefits Center, short code 48{n}', 1, W.spoof]],
			subj: [['New Medicare card: confirm your details', 1, 'Medicare cards are mailed free. You never have to confirm anything by text.'], ['You qualify for free medical supplies', 1, 'Free supplies tied to your Medicare number is a common fraud.'], ['Medicare update for {name}', 0, '']],
			open: ['Medicare is issuing new cards this month.', 'Your coverage may be changing this year.', 'You may be eligible for extra benefits.'],
			safe: ['Plan details are usually mailed to you.', 'Coverage year: {yr}.', 'Your reference number is {ref}.', 'You may have questions about your plan.', 'Benefits can change each year.', 'Reply HELP for help.'],
			flag: [['To receive it, reply with your Medicare number.', W.info], ['There is a $25 processing fee, paid by gift card.', W.gift], ['Your coverage ends if you do not confirm today.', W.threat], ['We also need your bank account number for deposits.', W.info], ['This offer ends in {hrs} hours.', W.urg], ['No doctor visit needed, we ship it free.', 'Free supplies for your Medicare number is a common fraud.'], ['Do not call Medicare, we handle everything for you.', 'Scammers discourage you from checking with the real Medicare.']],
			link: [['Verify here: medicare-update-center.com', 1, W.domain], ['Text YES to confirm now', 1, 'Replying tells the scammer your number is real and active.']],
			sign: [['Medicare Benefits Team', 1, W.vague], ['Plan Enrollment Dept.', 1, W.vague], ['Reference: {ref}', 0, '']],
			tip: "Medicare will never contact you first to ask for your number or a fee. New cards are free and come by mail. Call 1-800-MEDICARE yourself if you are unsure." },

		{ id: 'bank-alert', kind: 'text', gc: 'uti', gs: 'formal',
			vars: { bank: ['Summit Trust Bank', 'Heritage National Bank', 'Liberty First Bank', 'Pioneer Savings Bank'], amt: ['249.99', '389.00', '512.40', '1,099.00'] },
			from: [['{cell}', 1, 'A bank texts from its own short code, not a personal-looking number, and even that can be faked.'], ['Alerts from {bank} (via email: alerts@secure-mail.co)', 1, W.domain], ['From: Bank Security, no number shown', 1, W.spoof]],
			subj: [['Fraud alert on your debit card', 0, ''], ['ALERT!! Account LOCKED', 1, W.caps], ['Your {bank} account needs attention', 0, '']],
			open: ['We noticed a ${amt} purchase on your card ending in {last4}.', 'A sign-in to your account came from a new device.', 'A payment of ${amt} was attempted from your account.'],
			safe: ['Card ending in {last4}.', 'The attempt was made today at {time}.', 'Location: {city}.', 'If this was you, no action is needed.', 'Your account number is partly hidden for safety.', 'Reference: {ref}.'],
			flag: [['Reply with your full card number to cancel it.', W.info], ['Share the code we text you to verify your identity.', W.code], ['Your account will be locked in {hrs} hours.', W.urg], ['Do not visit a branch, this is faster.', W.avoid], ['Move your money to this safe account now.', "No bank asks you to move money to a 'safe account'."], ['Confirm your PIN and online password.', W.pw], ['Our fraud agent will call you from a private number.', 'Real fraud teams do not call from hidden numbers asking for details.']],
			link: [['Secure your account: {b}-verify.co/login', 1, W.domain], ['Call our fraud line at {phone}', 1, 'Use the number on the back of your card, not one from a text.']],
			sign: [['{bank} Security', 0, ''], ['Fraud Prevention Team', 1, W.vague], ['Msg and data rates may apply.', 0, '']],
			tip: "Do not tap links in texts about your account. Call the number on the back of your card. A bank never asks for your PIN, password or codes." },

		{ id: 'package', kind: 'text', gc: 'ui', gs: 'formal',
			vars: { brand: ['USPS', 'FedEx', 'UPS', 'DHL'], amt: ['1.99', '2.95', '3.40', '4.50'] },
			from: [['{cell}', 1, 'Delivery companies do not text from personal-looking numbers.'], ['{brand} Tracking <tracking@mail-delivery.info>', 1, W.domain], ['From: Delivery Notice, no company named', 1, W.vague]],
			subj: [['{brand}: Delivery attempt failed', 0, ''], ['Package on hold: action required', 1, 'A vague action-required notice is the hook. Real carriers name the item and sender.'], ['Your parcel is waiting!!', 1, W.caps]],
			open: ['We tried to deliver your package today.', 'Your parcel is being held at our depot.', 'We could not complete your delivery.'],
			safe: ['Tracking number: {trk}.', 'The address on file was incomplete.', 'Your parcel weighs 2.4 lbs.', 'Delivery was attempted at {time}.', 'Items are held for 10 days.', 'This is an automated message.'],
			flag: [['Pay a ${amt} redelivery fee to release it.', 'Real carriers do not ask for fees by text to redeliver.'], ['Your package will be returned in {hrs} hours.', W.urg], ['Enter your card details to schedule delivery.', W.info], ['Reply Y to activate the link below.', "Texts that ask you to reply so the link 'works' are fishing for a response."], ['Confirm your address, birthday and card number.', W.info], ['We cannot deliver without a payment on file.', 'Carriers do not need your card to bring you a package.']],
			link: [['Reschedule: {b}-redelivery.top/{n}', 1, W.domain], ['Track here: bit.ly/trk{n}', 1, W.short]],
			sign: [['{brand} Delivery Team', 0, ''], ['Customer Care', 1, W.vague], ['Msg ID {ref}', 0, '']],
			tip: "If you are not expecting a package, ignore it. If you are, go to the carrier's real website or app and type in the tracking number yourself. Carriers never ask for your card by text." },

		{ id: 'gift-card-boss', kind: 'email', gc: '-', gs: 'casual', ng: 1,
			vars: { last: ['Collins', 'Bennett', 'Foster', 'Murray', 'Hughes'], amt: ['100', '200', '250', '500'], n: ['4', '5', '6'] },
			greet: ['Hi {name},', 'Hello {name},', '{name},'],
			from: [['Pastor {last} <pastor.{last}@gmail.com>', 1, "A free email account that looks right is a trick. Your pastor or boss has an official address."], ['{last}, Director <director.{last}@outlook-mail.com>', 1, "A free email account that looks right is a trick. Your pastor or boss has an official address."], ['Mr. {last} <{last}.office@gmail.com>', 1, 'A free email account that looks right is a trick. Real leaders use their official address.']],
			subj: [['Quick favor, are you available?', 1, "A vague 'quick favor' subject is a common scam opener."], ['Urgent request', 1, W.urg], ['Hello', 0, '']],
			open: ['I am in a meeting and cannot talk, but I need your help.', 'I am traveling and cannot take calls right now.', 'I need someone I can trust with a small task.'],
			safe: ['It is for a few people in our community.', 'I would do it myself if I could.', 'It is a surprise gift.', 'I know you are busy.', 'I am counting on you.', 'Thank you so much, you are a blessing.'],
			flag: [['Please buy {n} gift cards worth ${amt} each.', W.gift], ['Scratch off the back and send me the codes.', W.gift], ['Keep it a secret, it is a surprise.', W.secret], ['I will pay you back later, but please do it today.', W.urg], ['Text me back only, do not call.', 'Scammers avoid calls because your voice would expose them.'], ['Do not mention this to anyone else.', W.secret], ['Take a photo of the card numbers and email it.', W.gift]],
			link: [['Reply-to: urgent.reply@mail.com', 1, "A reply address that differs from the sender's is a trick."], ['Send the codes to {cell}', 1, W.gift]],
			sign: [['Sent from my iPhone', 0, ''], ['Thanks, {last}', 0, ''], ['Blessings, your friend', 1, 'A vague closing instead of a name you can check.']],
			tip: "Real leaders do not ask for gift cards by email. Call them on a number you already have. Nobody legitimate will ever need gift card codes." },

		{ id: 'romance', kind: 'dm', gc: '-', gs: 'none', ng: 1,
			vars: { amt: ['1,800', '2,400', '3,500', '5,000'] },
			greet: ['Good morning, {name}.', 'Hello again, {name}.', 'Hi {name}, how was your day?'],
			from: [['Profile: Dr. Daniel Hart, engineer working overseas', 1, 'Overseas professionals who message strangers are a very common romance-scam profile.'], ['Profile: soldier stationed far from home', 1, 'Overseas professionals who message strangers are a very common romance-scam profile.'], ['Profile: widower, new friend (met online)', 1, 'Someone you met only online and have never seen in person should not be asking for money.']],
			subj: [['I have never felt this way about anyone', 1, W.love], ['Good morning, how did you sleep?', 0, ''], ['I miss our chats so much', 0, '']],
			open: ['I wish we could meet in person.', 'I have told you more than I have told anyone.', 'I had a hard week at work.'],
			safe: ['How was your garden this week?', 'I saw a sunset today and thought of you.', 'I hope your family is well.', 'Tell me about your day.', 'I am so glad we found each other.', 'You always make me smile.', 'I have been thinking about our chats.', 'You are the first person I tell good news to.', 'I cannot wait to hear back from you.'],
			flag: [['I cannot video call, my camera is broken.', W.video], ['I need ${amt} for a plane ticket to visit you.', 'Asking for money to come meet you is a classic romance-scam move.'], ['My business partner has frozen my account.', "A sudden money problem that only you can solve is the setup."], ['Please wire it, and do not tell your children.', W.secret], ['I will pay you back as soon as I get home.', 'Promises of repayment are never kept.'], ['Please send it as gift cards or crypto.', W.gift], ['It is an emergency, I am in the hospital abroad.', W.urg]],
			link: [['Message me on WhatsApp: wa.me/{n}77', 1, 'Moving a chat to a private app avoids the dating site\'s safety checks.'], ['Send it to this account: {n}-{n}-{n}', 1, W.wire]],
			sign: [['Forever yours, D.', 1, W.love], ['Your friend, Daniel', 0, ''], ['xo', 0, '']],
			tip: "Never send money to someone you have not met in person, however close you feel. Try a reverse image search of their photos, and talk it over with a friend or family member." },

		{ id: 'lottery', kind: 'email', gc: 'usyi', gs: 'formal',
			vars: { amt: ['250,000', '500,000', '1,500,000', '2,000,000'], fee: ['85', '149', '250', '395'] },
			from: [['Mega Prize Board <claims@global-prize-winners.com>', 1, W.domain], ['Winner Notification <noreply@sweeps-claims.net>', 1, W.domain], ['Customer Rewards <rewards@gmail.com>', 1, W.gov]],
			subj: [['CONGRATULATIONS!! You won ${amt}', 1, W.caps], ['You have been selected as a winner', 1, 'You cannot win a contest you never entered.'], ['Prize notification for {name}', 0, '']],
			open: ['Your email was randomly chosen in this month\'s drawing.', 'You are the grand prize winner of our international drawing.', 'Your name was drawn from millions of entries.'],
			safe: ['The prize amount is ${amt}.', 'Your claim number is {ref}.', 'The drawing took place on {date}.', 'This message is for the winner only.', 'Please read the steps below.', 'Claim period: 14 days.'],
			flag: [['First, pay a ${fee} processing fee by gift card.', W.fee], ['Send your bank account number so we can deposit it.', W.info], ['Do not share this win with anyone until you collect.', W.secret], ['You must claim within {hrs} hours or lose the prize.', W.urg], ['You did not have to enter. You were selected.', 'You cannot win a contest you never entered.'], ['Taxes must be paid up front to our agent.', W.fee], ['Send a copy of your ID and a voided check.', W.info]],
			link: [['Claim your prize: winner-claim-center.com', 1, W.domain], ['Reply to claims agent {agent} at claims@gmail.com', 1, W.gov]],
			sign: [['Prize Coordinator, {agent}', 1, W.badge], ['Global Sweepstakes Board', 1, W.vague], ['Congratulations again!', 0, '']],
			tip: "If you did not enter, you did not win. Real contests never charge fees or taxes up front. Delete it." },

		{ id: 'utility', kind: 'text', gc: 'ut', gs: 'formal',
			vars: { util: ['Piedmont Power', 'Triangle Electric', 'Capital Gas and Water'], amt: ['187.40', '264.15', '312.80', '455.00'] },
			from: [['{cell}', 1, 'Utility companies do not text from personal-looking numbers.'], ['{util} Billing <billing@{b}-payments.net>', 1, W.domain], ['From: Utility Billing, no company named', 1, W.vague]],
			subj: [['{util}: Your bill is past due', 0, ''], ['FINAL NOTICE: Power shutoff today', 1, W.caps], ['Service interruption notice', 0, '']],
			open: ['Your account shows a past-due balance of ${amt}.', 'We have not received your last payment.', 'Your service is scheduled for disconnection.'],
			safe: ['Account ending in {last4}.', 'Your service address is on file.', 'Our records show a missed payment.', 'Reference number {ref}.', 'Billing period: last month.', 'Your last bill was mailed on {date}.'],
			flag: [['Pay ${amt} within {hrs} hours or power will be shut off.', W.urg], ['Only gift cards or a cash app will be accepted now.', W.gift], ['A technician will be at your door in one hour.', W.urg], ['Do not call the number on your bill, it is closed.', W.avoid], ['Late fees will double today.', W.threat], ['Pay the technician in cash when he arrives.', W.cash], ['Reply with your account number and card info.', W.info]],
			link: [['Pay now: {b}-billing.pay/{n}', 1, W.domain], ['Call {phone} to pay by phone', 1, W.phone]],
			sign: [['{util} Collections Dept.', 1, 'Real utilities mail written notices and give you time before cutting service.'], ['Customer Billing', 0, ''], ['Thank you, Billing Office', 0, '']],
			tip: "Utilities send written notices and give you time. Call the number on your own bill (not the message) before paying anything, and never pay by gift card." },

		{ id: 'invoice', kind: 'email', gc: 'ut', gs: 'formal',
			vars: { brand: ['Amazon', 'PayPal', 'Apple'], amt: ['499.99', '699.00', '849.95', '1,249.00'] },
			from: [['{brand} Support <billing@{b}-orders.net>', 1, W.domain], ['{brand} Billing <no-reply@gmail.com>', 1, W.gov], ['Order Confirmation <orders@{b}-secure.co>', 1, W.domain]],
			subj: [['Your order of ${amt} has been confirmed', 0, ''], ['Invoice #{n}: payment received', 0, ''], ['URGENT: unauthorized charge on your account', 1, W.caps]],
			open: ['Thank you for your recent purchase.', 'A payment of ${amt} was processed on your account.', 'Your order was placed today at {time}.'],
			safe: ['Order number {ref}.', 'Item: 65-inch television.', 'Quantity: 1.', 'Payment method: card on file.', 'Billed to {name}.', 'Estimated delivery: 5 days.'],
			flag: [['If you did not make this purchase, call {phone} right away.', 'A phone number in an unexpected invoice leads straight to a scammer.'], ['Cancel within {hrs} hours or you will be charged.', W.urg], ['Our agent will ask to access your computer to cancel.', W.remote], ['We will refund you, just confirm your bank login.', W.pw], ['The refund will be sent as gift card codes.', W.gift], ['Do not use the official website, it is under maintenance.', W.avoid], ['Never share this email with your bank.', W.secret]],
			link: [['Cancel order: {b}-help-center.com', 1, W.domain], ['Call billing: {phone}', 1, W.phone]],
			sign: [['{brand} Customer Service', 0, ''], ['Billing Dept.', 1, W.vague], ['This is an automated message.', 0, '']],
			tip: "If you do not recognize a charge, sign in through the official app or website (not the email) and check. Never call a number from an unexpected invoice." },

		{ id: 'investment', kind: 'dm', gc: 'sy', gs: 'casual',
			vars: { handle: ['wealth_mentor', 'profit_guide', 'secure_gains'], n: ['12', '8', '15'] },
			greet: ['Hello {name},', 'Hi {name},', 'Good afternoon {name},'],
			from: [['Alex Morgan, Wealth Advisor <alex@invest-gains.io>', 1, 'You never asked for this advisor. Check anyone with your state securities office first.'], ['Crypto Club <hello@cryptoclub-gains.com>', 1, W.domain], ['A stranger from a group chat', 1, 'Unsolicited investment tips from strangers are a warning sign.']],
			subj: [['Limited spots: earn 20% a week', 1, W.good], ['Exclusive investment opportunity', 1, W.vague], ['Market update for {name}', 0, '']],
			open: ['I help retirees grow their savings safely.', 'My clients have been earning steady returns.', 'I wanted to share an opportunity with you.'],
			safe: ['It all happens through a simple app.', 'I have been investing for over ten years.', 'Thousands of people are already in.', 'You can start with a small amount.', 'Many people retire early this way.', 'It is easy to get started.'],
			flag: [['Guaranteed 20% returns every month, no risk.', W.good], ['You must invest today, only {n} spots left.', W.urg], ['Send payment in Bitcoin to this wallet.', W.wire], ['Pull money from your retirement account to join.', 'Pushing you to drain your savings is a warning sign.'], ['Do not tell your family, they will not understand.', W.secret], ['I am not licensed, but I am very successful.', W.lic], ['Wire the funds and I will handle the rest.', W.wire]],
			link: [['Join here: wealth-gain-club.io/join', 1, W.domain], ['Message me on Telegram @{handle}', 1, 'Moving to a private chat avoids any safety checks.']],
			sign: [['Best regards, Alex Morgan, CEO', 1, W.vague], ['Alex', 0, ''], ['Investing in your future', 0, '']],
			tip: "Be wary of promised returns and pressure. Check any advisor with your state securities office or FINRA BrokerCheck, and never invest because a stranger contacted you." },

		{ id: 'fake-check', kind: 'email', gc: '-', gs: 'casual', ng: 1,
			vars: { amt: ['800', '1,200', '1,500', '2,000'], last: ['Reed', 'Dawson', 'Ellis', 'Grant'] },
			greet: ['Hello,', 'Hi there,', 'Hello {name},'],
			from: [['Interested Buyer <rick.buyer88@gmail.com>', 1, 'A buyer who writes from a free account, far away, and offers more than you asked is suspect.'], ['{last} Purchasing <purchasing.{last}@outlook-mail.com>', 1, 'A buyer who writes from a free account, far away, and offers more than you asked is suspect.'], ['Mr. {last} <{last}.buyer@gmail.com>', 1, 'A buyer who writes from a free account, far away, and offers more than you asked is suspect.']],
			subj: [['Re: your listing, I will take it', 0, ''], ['Interested in your item', 0, ''], ['I will pay more than your asking price!', 1, 'Offering extra money is the hook of a fake check scam.']],
			open: ['I would like to buy the item you listed.', 'I am interested in your listing and can pay today.', 'I will send payment right away.'],
			safe: ['Please confirm the item is still available.', 'I am out of town for work.', 'The item looks great in the photos.', 'I can pay by certified check.', 'My assistant will mail the check.', 'I will arrange my own pickup.'],
			flag: [['I will send a check for ${amt} more than your price.', W.fake], ['Deposit it, then wire the extra to my shipper.', W.fake], ['The funds will be available right away.', "'Available' is not 'cleared'. The bank can undo it weeks later."], ['Do not wait for the check to clear.', W.fake], ['I cannot meet in person, I am overseas.', 'A buyer who cannot meet or see the item is a red flag.'], ['Send the item before the check clears.', W.fake], ['Keep our deal private for tax reasons.', W.secret]],
			link: [['Send your full name and address to {cell}', 1, 'Giving personal details to a stranger helps them target you.'], ['Pay my shipper through a cash app: {cell}', 1, W.wire]],
			sign: [['Thanks, Rick', 0, ''], ['Sent from my phone', 0, ''], ['Regards, Mr. {last}', 0, '']],
			tip: "Never send money back from a check you deposited. Banks can take weeks to discover a fake. When you sell something, prefer cash in person at a public place." },

		{ id: 'charity', kind: 'email', gc: 'us', gs: 'formal',
			vars: { cause: ['Gulf Coast Relief Fund', 'American Heroes Alliance', 'Kids First Cancer Aid'], amt: ['50', '75', '100', '250'] },
			from: [['Donation Team <give@relief-fund-now.com>', 1, W.domain], ['{cause} Volunteer <volunteer@gmail.com>', 1, W.gov], ['Help Center <donate@{b}-giving.net>', 1, W.domain]],
			subj: [['Help families in need today', 0, ''], ['Your gift can save a life', 0, ''], ['EMERGENCY: they need you now', 1, W.caps]],
			open: ['Thousands of families have lost everything.', 'Many of our veterans are in need this season.', 'Children are waiting for your help.'],
			safe: ['Every dollar makes a difference.', 'Winter is especially hard for many.', 'Your gift supports local families.', 'Gifts are accepted online and by check.', 'Volunteers have helped many families.', 'You may also donate by mail.'],
			flag: [['Donate by gift card or cash app only.', W.gift], ['Give ${amt} right now to be matched ten times.', W.urg], ['We cannot tell you where your money goes.', 'Real charities are open about how they use your gift.'], ['We will call every day until you give.', 'Pressure and daily calls are not how real charities work.'], ['Wire your gift directly to our volunteer.', W.wire], ['Please read us your card number over the phone.', W.info], ['The gift is not tax deductible, but give anyway.', 'Real charities tell you honestly whether your gift is deductible.']],
			link: [['Donate: {b}-giving.top', 1, W.domain], ['Call and give now: {phone}', 1, W.phone]],
			sign: [['Sincerely, Volunteer {agent}', 0, ''], ['The {cause} Team', 0, ''], ['Thank you for your generosity', 0, '']],
			tip: "Give only to charities you have looked up yourself, such as through Charity Navigator or your state's charity list. Do not give to callers who pressure you, and never by gift card." },

		{ id: 'contractor', kind: 'text', gc: '-', gs: 'casual', ng: 1,
			vars: { amt: ['1,500', '2,200', '3,000', '4,500'], n: ['2', '3', '4'] },
			greet: ['Hello,', 'Hi there,', 'Good morning,'],
			from: [['{cell}', 1, 'An unknown number from someone you never contacted.'], ['A local number you do not recognize', 1, 'An unknown number from someone you never contacted.'], ['{cell} (no business name)', 1, 'An unknown number from someone you never contacted.']],
			subj: [['I am working on roofs in your neighborhood', 0, ''], ['We noticed damage to your roof', 1, 'A stranger who says they spotted damage on your home is a classic scam opener.'], ['Free home inspection today only', 1, W.urg]],
			open: ['We just finished a job near your street.', 'We have leftover materials from a nearby project.', 'Our crew is in your area today.'],
			safe: ['Our crew has 15 years of experience.', 'We use quality materials.', 'We can give you a quote.', 'We serve this whole county.', 'Our truck is a white pickup.', 'Estimates depend on size.'],
			flag: [['We need ${amt} in cash up front to start today.', W.cash], ['This price is only good for today.', W.urg], ['We found damage you cannot see from the ground.', 'Surprise hidden damage found by a stranger is how scammers pad the bill.'], ['We will skip the permit to save you money.', 'Skipping permits is illegal and leaves you stuck with the problem.'], ['Pay cash and we will give you a discount.', W.cash], ['Your insurance does not need to know.', W.secret], ['Sign the contract now, we will read it later.', W.urg]],
			link: [['Reply YES and we will be at your door in 20 minutes', 1, W.urg], ['Call us for a free estimate: {phone}', 0, '']],
			sign: [['Mike, Quick Roofing and Repair', 0, ''], ['Licensed and insured (no license number)', 1, W.lic], ['Your local contractor', 0, '']],
			tip: "Get three written estimates, check the contractor's license with your state board, and never pay big amounts in cash up front. Take your time and ask a family member to review the contract." },

		{ id: 'subscription', kind: 'email', gc: 'ut', gs: 'formal',
			vars: { brand: ['Norton', 'McAfee', 'Geek Squad'], amt: ['299.99', '349.00', '399.99', '449.00'] },
			from: [['{brand} Renewals <noreply@{b}-renew.net>', 1, W.domain], ['{brand} Billing <support@{b}-billing.co>', 1, W.domain], ['Auto-Renew Dept <renewals@gmail.com>', 1, W.gov]],
			subj: [['Receipt: {brand} 2-year protection', 0, ''], ['Auto-renewal confirmation', 0, ''], ['Your payment of ${amt} was successful!!', 1, W.caps]],
			open: ['Thank you for renewing your protection plan.', 'Your subscription has been renewed for two years.', 'Your annual plan was just charged.'],
			safe: ['Invoice number: {ref}.', 'Plan: Total Protection, 2 years.', 'Charged to your card on file.', 'Renewal date: {date}.', 'The charge will appear within 2 days.', 'Billed to: {name}.'],
			flag: [['If you did not authorize this, call {phone}.', W.phone], ['To cancel and get a refund, we need to access your computer.', W.remote], ['Refunds are given only as gift cards.', W.gift], ['You must call within {hrs} hours to stop the charge.', W.urg], ['Do not contact your bank, we handle disputes.', W.avoid], ['We will refund too much, then you send back the difference.', W.fake], ['Confirm your bank login to receive the refund.', W.pw]],
			link: [['Cancel subscription: {b}-cancel.co', 1, W.domain], ['Call billing: {phone}', 1, W.phone]],
			sign: [['{brand} Billing Department', 0, ''], ['Auto-billing team', 1, W.vague], ['Thank you for your loyalty!', 0, '']],
			tip: "A surprise 'receipt' you did not ask for is bait. Do not call the number. Check your real subscriptions in your account or on your bank statement." },

		{ id: 'jury-duty', kind: 'voicemail', gc: 'ust', gs: 'none', ng: 1,
			vars: { amt: ['950', '1,200', '1,800', '2,300'] },
			greet: ['Hello, this message is for {name}.', 'Good morning, I am calling for {name}.', 'Hello, this is a message for {name}.'],
			greetF: [['This message is for the person named on the case.', W.greet], ['Hello, this message is for the resident.', W.greet]],
			from: [["Caller ID: County Sheriff's Office", 1, W.spoof], ['Caller ID: Court Clerk', 1, W.spoof], ['Caller ID: Unknown', 1, W.spoof]],
			subj: [["This is Deputy {agent} with the Sheriff's Office.", 1, 'Real officers do not leave voicemails demanding money.'], ['This message is about a missed jury duty.', 0, ''], ['I am calling about a legal matter for {name}.', 0, '']],
			open: ['You missed jury duty last month.', 'A court order was issued in your name.', 'There is a warrant regarding your case.'],
			safe: ['Your case number is {ref}.', 'This is about a county court matter.', 'A notice was mailed to your address.', 'The date was {date}.', 'The fine is ${amt}.', 'Please listen carefully.', 'We are calling from the county office.', 'Our office is open on weekdays.'],
			flag: [['You will be arrested today unless you pay the fine.', W.threat], ['Pay the fine with gift cards at a nearby store.', W.gift], ['Do not tell anyone about this call.', W.secret], ['Stay on the line while you go buy them.', W.stay], ['Confirm your Social Security number to clear your name.', W.info], ['Officers will arrive at your home in one hour.', W.threat], ['You can avoid arrest by paying a bond right now.', W.urg]],
			link: [['Call back {phone} and ask for Deputy {agent}', 1, W.phone], ['Press 2 to speak with the clerk', 1, 'Pressing buttons on a robocall connects you to the scammer.']],
			sign: [['Deputy {agent}, Badge #{n}', 1, W.badge], ['County Court Services', 1, W.vague], ['Goodbye.', 0, '']],
			tip: "Courts do not call to demand fines or take payment by phone or gift card. Hang up and call the court clerk using the number on the official county website." },

		{ id: 'wrong-code', kind: 'text', gc: '-', gs: 'none', ng: 1,
			vars: {},
			greet: ['Hi!', 'Hello!', 'Hey there,'],
			from: [['{cell}', 1, 'A stranger texting you out of the blue.'], ['A number you do not know', 1, 'A stranger texting you out of the blue.'], ['{cell} (no name)', 1, 'A stranger texting you out of the blue.']],
			subj: [['Hi, I accidentally sent you a code', 1, "Codes are never sent 'by accident' to a stranger. It is a trap."], ['Hey, did you get my text?', 0, ''], ['Oops, wrong number?', 0, '']],
			open: ['I think I typed the wrong number.', 'Sorry to bother you.', 'I am trying to reach my friend.'],
			safe: ['I am locked out of my account.', 'It is just a six-digit code.', 'I will delete it after.', 'It is my first time using this.', 'I am in a hurry.', 'I do not want to bother my family.', 'I am really sorry about this.', 'I think I wrote the number down wrong.', 'This is so awkward.'],
			flag: [['Can you read me the code that was just sent to you?', W.code], ['It is a harmless verification, it will not affect your phone.', W.code], ['Please send it quickly, my account is locked.', W.urg], ['I will pay you $20 if you forward the code.', 'Paying you for a code is a bribe to get you to hand over an account.'], ['Do not worry, it is only a verification.', W.code]],
			link: [['Reply with the 6-digit code', 1, W.code], ['Forward the code to this number', 1, W.code]],
			sign: [['Thanks a lot!', 0, ''], ['- a friend', 1, 'A vague sign-off with no name.'], ['Sorry again', 0, '']],
			tip: "Never share a verification code that was sent to you. If you get one you did not ask for, ignore it. Codes are the keys to your accounts." },

		{ id: 'grant', kind: 'email', gc: 'usyi', gs: 'formal',
			vars: { amt: ['9,000', '12,500', '15,000', '20,000'], fee: ['89', '149', '199', '249'] },
			from: [['Federal Grant Office <grants@us-grants-center.com>', 1, W.gov], ['Senior Benefits <benefits@gmail.com>', 1, W.gov], ['Grant Approval <noreply@federal-awards.net>', 1, W.gov]],
			subj: [['You qualify for a free government grant', 1, "Government grants are not handed out by unsolicited email."], ['Grant approved: ${amt}', 1, 'You cannot be approved for a grant you never applied for.'], ['Grant program notice', 0, '']],
			open: ['Seniors in your area are receiving grant money.', 'You have been approved for a federal grant.', 'A grant fund has been set aside for you.'],
			safe: ['No repayment is required.', 'Your grant ID is {ref}.', 'Funds are limited this year.', 'The application takes five minutes.', 'There is no credit check.', 'Thousands of people have received grants.'],
			flag: [['Pay a ${fee} processing fee to release the money.', W.fee], ['Send the fee by gift card or wire.', W.gift], ['We need your bank account and routing number.', W.info], ['Act today before the funds run out.', W.urg], ['Do not apply through the official website.', W.avoid], ['You are guaranteed to receive the funds.', W.good], ['A government agent will call you, say yes to everything.', 'Scammers script what you should say to hide the scam.']],
			link: [['Claim: us-senior-grants.org', 1, W.gov], ['Call {agent} at {phone}', 1, W.phone]],
			sign: [['Federal Grants Office', 1, W.vague], ['Program Director {agent}', 1, W.badge], ['Have a great day', 0, '']],
			tip: "The government does not contact you out of the blue to give you a grant, and it never charges a fee to receive money. Real grants are listed at grants.gov." }
	];

	/* ---------- Builder ---------- */

	var STAT = {
		hrs: ['2', '12', '24', '48'],
		amt: ['149', '249', '399', '899', '1,250', '2,400'],
		fee: ['85', '149', '250', '395'],
		time: ['9:14 AM', '11:32 AM', '1:42 PM', '4:08 PM', '6:05 PM', '8:47 PM'],
		date: ['March 3', 'April 18', 'May 22', 'June 9', 'July 14', 'August 30', 'September 12', 'October 5', 'November 20'],
		yr: ['2023', '2024', '2025'],
		city: ['Dallas, TX', 'Tampa, FL', 'Phoenix, AZ', 'Denver, CO', 'Atlanta, GA', 'Portland, OR'],
		agent: ['Johnson', 'Miller', 'Carter', 'Brooks', 'Reynolds', 'Hayes', 'Powell'],
		last: ['Collins', 'Bennett', 'Foster', 'Murray', 'Hughes'],
		gp: ['Grandma', 'Grandpa'],
		bank: ['Summit Trust Bank', 'Heritage National Bank', 'Liberty First Bank'],
		util: ['Piedmont Power', 'Triangle Electric', 'Capital Gas and Water'],
		cause: ['Gulf Coast Relief Fund', 'American Heroes Alliance', 'Kids First Cancer Aid'],
		brand: ['Amazon', 'PayPal', 'Apple'],
		handle: ['wealth_mentor', 'profit_guide', 'secure_gains'],
		n: ['12', '48', '73', '305', '618', '942']
	};

	function rngFrom(seed) {
		var a = seed >>> 0;
		return function () {
			a = (a + 0x6D2B79F5) | 0;
			var t = Math.imul(a ^ (a >>> 15), 1 | a);
			t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
			return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
		};
	}
	function seedFor(n, salt) { return (Math.imul(n + 1, 2654435761) ^ Math.imul(salt + 7, 40503) ^ 0x5bd1e995) >>> 0; }
	function pick(r, a) { return a[Math.floor(r() * a.length)]; }
	function shuffle(r, a) {
		var b = a.slice();
		for (var i = b.length - 1; i > 0; i--) { var j = Math.floor(r() * (i + 1)); var t = b[i]; b[i] = b[j]; b[j] = t; }
		return b;
	}
	function digits(r, k) { var s = ''; for (var i = 0; i < k; i++) { s += Math.floor(r() * 10); } return s; }

	/* Which scam type is on day n: every type once per round, in a different order each round. */
	function typeFor(n) {
		var T = TYPES.length, block = Math.floor(n / T), pos = n % T;
		function order(b) { return shuffle(rngFrom(seedFor(b, 991)), TYPES.map(function (_, i) { return i; })); }
		var p = order(block);
		if (block > 0 && p[0] === order(block - 1)[T - 1]) { var t = p[0]; p[0] = p[1]; p[1] = t; }
		return TYPES[p[pos]];
	}

	function makeVars(r, type) {
		var cache = {};
		var tv = type.vars || {};
		var gen = {
			name: function () { return pick(r, NAMES); },
			ref: function () { return 'CS-' + digits(r, 5); },
			phone: function () { return '1-' + pick(r, ['800', '888', '877', '866']) + '-555-01' + digits(r, 2); },
			cell: function () { return '(' + pick(r, ['919', '984', '336', '704', '252', '615']) + ') 555-01' + digits(r, 2); },
			last4: function () { return digits(r, 4); },
			trk: function () { return '9400 ' + digits(r, 4) + ' ' + digits(r, 4) + ' ' + digits(r, 2); },
			b: function () { return String(vars('brand') || vars('bank') || vars('util') || vars('cause') || 'secure').toLowerCase().replace(/[^a-z]/g, ''); }
		};
		function vars(key) {
			if (cache[key] !== undefined) { return cache[key]; }
			var v = null;
			if (tv[key]) { v = pick(r, tv[key]); }
			else if (gen[key]) { v = gen[key](); }
			else if (STAT[key]) { v = pick(r, STAT[key]); }
			if (v !== null) { cache[key] = v; }
			return v;
		}
		return vars;
	}
	function fill(text, vars) {
		return text.replace(/\{(\w+)\}/g, function (m, k) { var v = vars(k); return v === null ? m : v; });
	}

	function build(n, attempt) {
		var r = rngFrom(seedFor(n, attempt));
		var type = typeFor(n);

		var from = pick(r, type.from), subj = pick(r, type.subj), link = pick(r, type.link), sign = pick(r, type.sign);
		var open = pick(r, type.open);

		var greet;
		var gFlag = !type.ng && r() < 0.3;
		if (gFlag) { greet = pick(r, type.greetF || GREET_FLAG); greet = [greet[0], 1, greet[1]]; }
		else { greet = [pick(r, type.greet || GREET_SAFE), 0, '']; }
		if (type.ng && type.greetF && r() < 0.22) { var gf = pick(r, type.greetF); greet = [gf[0], 1, gf[1]]; }

		/* Body: bf red flags among 10 pieces. Mostly from this scam type, some shared. */
		var bf = pick(r, [3, 3, 4, 4, 5]);
		var own = shuffle(r, type.flag);
		var nShared = Math.min(bf, r() < 0.5 ? 1 : 2);
		var nOwn = bf - nShared;
		var flags = own.slice(0, nOwn).map(function (f) { return { t: f[0], f: 1, w: f[1] }; });
		var cats = {}, pool = shuffle(r, GF.filter(function (g) { return (type.gc === undefined ? 'us' : type.gc).indexOf(g.c) !== -1; }));
		for (var i = 0; i < pool.length && flags.length < bf; i++) {
			if (cats[pool[i].c]) { continue; }
			cats[pool[i].c] = 1;
			flags.push({ t: pool[i].t, f: 1, w: pool[i].w });
		}
		for (var k = nOwn; flags.length < bf && k < own.length; k++) { flags.push({ t: own[k][0], f: 1, w: own[k][1] }); }
		var safeNeeded = 10 - flags.length;
		var safes = shuffle(r, type.safe).slice(0, Math.min(safeNeeded, type.gs === 'none' ? safeNeeded : 4 + Math.floor(r() * 2)));
		var rest = shuffle(r, type.safe).filter(function (x) { return safes.indexOf(x) === -1; });
		var shared = type.gs === 'none' ? rest : shuffle(r, type.gs === 'casual' ? GS_CASUAL : GS);
		for (var j = 0; safes.length < safeNeeded && j < shared.length; j++) { safes.push(shared[j]); }
		var body = flags.concat(safes.map(function (s) { return { t: s, f: 0, w: '' }; }));
		body = shuffle(r, body);

		var tiles = [
			{ t: from[0], f: from[1], w: from[2] },
			{ t: subj[0], f: subj[1], w: subj[2] },
			{ t: greet[0], f: greet[1], w: greet[2] },
			{ t: open, f: 0, w: '' }
		].concat(body, [
			{ t: link[0], f: link[1], w: link[2] },
			{ t: sign[0], f: sign[1], w: sign[2] }
		]);

		var total = 0;
		tiles.forEach(function (t) { total += t.f ? 1 : 0; });

		var vars = makeVars(rngFrom(seedFor(n, attempt + 500)), type);
		tiles.forEach(function (t) { t.t = fill(t.t, vars); t.w = t.w ? fill(t.w, vars) : ''; });

		var seen = {}, dup = false;
		tiles.forEach(function (t) { if (seen[t.t]) { dup = true; } seen[t.t] = 1; });

		return { type: type, tiles: tiles, total: total, dup: dup, r: r, vars: vars };
	}

	/* Neighbors of tile i in the 2-column grid, corners included. */
	function neighbors(i) {
		var row = i >> 1, col = i & 1, out = [];
		for (var dr = -1; dr <= 1; dr++) {
			for (var dc = -1; dc <= 1; dc++) {
				if (!dr && !dc) { continue; }
				var rr = row + dr, cc = col + dc;
				if (rr < 0 || rr > 7 || cc < 0 || cc > 1) { continue; }
				out.push(rr * 2 + cc);
			}
		}
		return out;
	}

	function make(n) {
		n = Math.max(0, Math.floor(n));
		var g = null;
		for (var attempt = 0; attempt < 80; attempt++) {
			g = build(n, attempt);
			if (g.total >= 5 && g.total <= 7 && !g.dup) { break; }
		}
		var kind = KINDS[g.type.kind];
		var tiles = g.tiles.map(function (t, i) {
			var count = 0;
			neighbors(i).forEach(function (j) { if (g.tiles[j].f) { count++; } });
			var label = i === 0 ? kind.l[0] : i === 1 ? kind.l[1] : i === 14 ? kind.l[2] : i === 15 ? kind.l[3] : '';
			return { t: t.t, f: t.f, w: t.w, c: count, l: label };
		});
		/* The tile that starts cleared: a safe tile with a small, useful number. */
		var cands = [];
		tiles.forEach(function (t, i) { if (!t.f && t.c >= 1 && t.c <= 2) { cands.push(i); } });
		if (!cands.length) { tiles.forEach(function (t, i) { if (!t.f) { cands.push(i); } }); }
		var start = pick(g.r, cands);
		return { n: n, id: g.type.id, kind: g.type.kind, kindName: kind.name, tiles: tiles, total: g.total, start: start, tip: g.type.tip };
	}

	var api = { start: [2026, 11, 26], make: make, neighbors: neighbors, types: TYPES.length, strikes: 3 };
	root.CWC_GAME = api;
	if (typeof module !== 'undefined' && module.exports) { module.exports = api; }
})(typeof window !== 'undefined' ? window : globalThis);
