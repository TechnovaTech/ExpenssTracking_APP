# Email OTP Setup - Using Brevo (Free Service)

## Why One Email Service?

**Question:** Users have different emails, why configure one email?

**Answer:** 
- Your app needs ONE email account to SEND OTPs
- Users can have ANY email to RECEIVE OTPs

```
Your App Email          →    Sends OTP    →    User's Email
noreply@yourapp.com     →    123456       →    john@gmail.com
noreply@yourapp.com     →    789012       →    mary@yahoo.com
noreply@yourapp.com     →    345678       →    alex@outlook.com
```

---

## Setup Brevo (Recommended - FREE)

### Step 1: Create Brevo Account
1. Go to https://brevo.com
2. Click "Sign up free"
3. Verify your email
4. **Free Plan: 300 emails/day** ✅

### Step 2: Get API Key
1. Login to Brevo
2. Go to https://app.brevo.com/settings/keys/api
3. Click "Generate a new API key"
4. Copy the API key

### Step 3: Configure Backend
Update `d:\ExpenssApp\otp-backend\.env.local`:
```
BREVO_EMAIL=your-email@example.com
BREVO_API_KEY=xkeysib-xxxxxxxxxxxxx
```

### Step 4: Start Backend
```bash
cd d:\ExpenssApp\otp-backend
npm run dev
```

---

## Alternative: Gmail (If you prefer)

### Step 1: Create Gmail Account
Create: `expensetrackerapp@gmail.com`

### Step 2: Enable 2-Step Verification
1. Go to https://myaccount.google.com/security
2. Enable 2-Step Verification

### Step 3: Generate App Password
1. Go to https://myaccount.google.com/apppasswords
2. Create password for "Mail"
3. Copy 16-character password

### Step 4: Configure Backend
Update `.env.local`:
```
EMAIL_USER=expensetrackerapp@gmail.com
EMAIL_PASSWORD=your-16-char-password
```

Then update `send-otp.js` to use Gmail:
```javascript
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});
```

---

## How It Works

1. **User enters their email:** `user123@gmail.com`
2. **Your app sends OTP from:** `noreply@yourapp.com`
3. **User receives OTP at:** `user123@gmail.com`
4. **User enters OTP and logs in**

---

## Comparison

| Service | Free Limit | Setup | Best For |
|---------|-----------|-------|----------|
| **Brevo** | 300/day | Easy (API key) | Production ✅ |
| **SendGrid** | 100/day | Easy (API key) | Production ✅ |
| **Gmail** | 500/day | Medium (App password) | Testing |
| **Outlook** | 300/day | Medium (Password) | Testing |

---

## Testing

1. Start backend: `npm run dev`
2. Start Flutter app: `flutter run -d chrome`
3. Enter ANY email address (yours or anyone's)
4. Check that email for OTP
5. Enter OTP to login

**Note:** The email you configure is ONLY for sending. Users can use ANY email to receive OTPs!
