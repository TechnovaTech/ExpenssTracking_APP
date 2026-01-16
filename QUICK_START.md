# Quick Start Guide - Gmail OTP Setup

## ✅ Your Configuration is Ready!

Your Gmail App Password: `pyky ydlv lecv gzwi`

---

## Step 1: Update Email in .env.local

Open: `d:\ExpenssApp\otp-backend\.env.local`

Replace `your-email@gmail.com` with YOUR actual Gmail address:

```
EMAIL_USER=youremail@gmail.com
EMAIL_PASSWORD=pyky ydlv lecv gzwi
```

---

## Step 2: Start Backend Server

```bash
cd d:\ExpenssApp\otp-backend
npm run dev
```

You should see: `✓ Ready on http://localhost:3000`

---

## Step 3: Install Flutter Dependencies

```bash
cd d:\ExpenssApp\expenss_tracker
flutter pub get
```

---

## Step 4: Run Flutter App

```bash
flutter run -d chrome
```

---

## How to Test

1. Open the app in Chrome
2. Enter ANY email address (yours or someone else's)
3. Click "Send OTP"
4. Check that email inbox for OTP
5. Enter the 6-digit OTP
6. You'll be logged in!

---

## Important Notes

- ✅ Password is already configured
- ✅ Just add your Gmail address
- ✅ Backend sends OTP from YOUR Gmail
- ✅ Users can use ANY email to receive OTP
- ✅ OTP expires in 5 minutes

---

## Troubleshooting

**If OTP doesn't send:**
1. Make sure backend is running (`npm run dev`)
2. Check your Gmail address is correct in `.env.local`
3. Check console for error messages
4. Make sure password has no extra spaces: `pykuydlvlecvgzwi`

**If Flutter can't connect:**
1. Make sure backend URL is `http://localhost:3000/api`
2. Check if backend is running
3. Try restarting both backend and Flutter app
