# Email OTP Authentication Setup

## Backend Setup (Next.js)

### 1. Navigate to backend folder
```bash
cd d:\ExpenssApp\otp-backend
```

### 2. Install dependencies
```bash
npm install
```

### 3. Configure Gmail App Password
1. Go to https://myaccount.google.com/apppasswords
2. Create a new App Password for "Mail"
3. Copy the 16-character password

### 4. Update .env.local file
```
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-16-char-app-password
```

### 5. Start the backend server
```bash
npm run dev
```
Backend will run on: http://localhost:3000

---

## Flutter App Setup

### 1. Navigate to Flutter project
```bash
cd d:\ExpenssApp\expenss_tracker
```

### 2. Install dependencies
```bash
flutter pub get
```

### 3. Update main.dart
Change the initial route to LoginScreen:
```dart
import 'screens/login_screen.dart';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      home: const LoginScreen(), // Start with login
    );
  }
}
```

### 4. Run the app
```bash
flutter run -d chrome
```

---

## How It Works

1. User enters email on Login Screen
2. Flutter app calls Next.js API: `/api/send-otp`
3. Backend generates 6-digit OTP and sends email
4. User enters OTP on Verification Screen
5. Flutter app calls Next.js API: `/api/verify-otp`
6. If valid, user is redirected to Home Screen

---

## Testing

1. Start backend: `npm run dev` (in otp-backend folder)
2. Start Flutter: `flutter run -d chrome`
3. Enter your email
4. Check your email for OTP
5. Enter OTP to login

---

## Important Notes

- Backend must be running before testing Flutter app
- Use Gmail App Password, not regular password
- OTP expires in 5 minutes
- For production, use Redis instead of in-memory storage
