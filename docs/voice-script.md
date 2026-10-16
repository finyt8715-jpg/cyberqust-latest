# Voice script for the Voice trap (Level 4)

Record each line as one audio file named exactly like the first column (for example `c1-a.mp3`) and put it in `public/audio/voice/`.
Formats: mp3, m4a, webm, ogg, wav. Lines without a file use the built-in synthetic voice. Speak as the caller, not as the player.

## Call 1: IT Helpdesk (scam call)

Caller ID: +91 11 4000 8812 (Not in your contacts)

| File | What the caller says |
|---|---|
| `c1-a.mp3` | Hello, this is Rakesh from the IT helpdesk. Our system shows malware on your laptop that is leaking company data. I need to fix it right now, before it spreads. |
| `c1-b.mp3` | Great. I am sending a 6-digit code to your phone. Read it to me and I will clear the virus. Please do not tell anyone, this is confidential. |
| `c1-c.mp3` | There is no time for tickets. If you hang up, your account will be locked in five minutes. Do you want to lose all your files? |

## Call 2: Apex Supplies (scam call)

Caller ID: +91 98765 43210 (Calling about a payment)

| File | What the caller says |
|---|---|
| `c2-a.mp3` | Hi, this is Meera from Apex Supplies, your regular vendor. We changed banks last week. Please update our account before today’s 4 PM payment run, or our shipment will be held and you will be fined. |
| `c2-b.mp3` | The new account is 4412 8890 3321. I will email the form later, please process it first. And please do not involve your manager, they are travelling. |
| `c2-c.mp3` | Calling back would take too long. It is a big penalty if this payment bounces. Just this once? |

## Call 3: Bank Fraud Desk (scam call)

Caller ID: 1800 000 5521 (Caller ID shows a bank number)

| File | What the caller says |
|---|---|
| `c3-a.mp3` | This is the fraud prevention team at your bank. We have blocked a suspicious ₹48,000 transaction on your card. To cancel it, I need to confirm your card details right now. |
| `c3-b.mp3` | For your safety, just read me your card number, the CVV and your PIN. This is a special secure line, the number on your card will not connect you. |
| `c3-c.mp3` | Hurry, the transaction will go through in two minutes. Read the numbers now. |

## Call 4: IT Service Desk (genuine call)

Caller ID: Ext. 4001 (Internal extension in your directory)

| File | What the caller says |
|---|---|
| `c4-a.mp3` | Hi, this is Karan from the IT Service Desk. I am following up on ticket INC-2291 you raised yesterday about your slow laptop. Do you have two minutes? |
| `c4-b.mp3` | I will start a remote session with the company tool, you will see an approval prompt on screen. I will never ask for your password. |
