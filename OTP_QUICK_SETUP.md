# OTP Verification Setup Guide

## Quick Start (3 Steps)

### 1. Start the Backend Server
```bash
# Double-click this file or run in terminal:
setup_and_run.bat
```

### 2. Test OTP API (Optional)
- Open `test_otp_simple.html` in your browser
- Enter an email address and click "Send OTP"
- Check your email for the OTP code
- Enter the OTP and click "Verify OTP"

### 3. Run Flutter App
```bash
cd expenss_tracker
flutter run
```

## How It Works

1. **Login Screen**: Enter your email → Click "Continue with Email"
2. **OTP Email**: Check your email for a 6-digit code
3. **Verification**: Enter the OTP code → Click "Verify Code"
4. **Success**: You'll be redirected to the Home Screen

## Troubleshooting

### "Network error" in Flutter app:
- Make sure the backend server is running (step 1)
- Check that it's running on `http://localhost:3000`

### "Failed to send OTP":
- Check your email configuration in `.env.local`
- Make sure the Gmail app password is correct

### OTP not received:
- Check spam/junk folder
- Verify the email address is correct
- Check server console for error messages

## Email Configuration

The app uses Gmail to send OTP emails. Configuration is in:
```
expenss_trackerAdmin/.env.local
```

Current settings:
- Email: hello.technovatechnologies@gmail.com
- App Password: pyky ydlv lecv gzwi

## Files Modified

- `lib/services/otp_service.dart` - Fixed port and added error handling
- Created helper scripts for easy setup and testing

## Next Steps

Once OTP verification works, you can:
- Customize the email template
- Add user registration
- Implement proper authentication tokens
- Add database storage for users