import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:flutter/foundation.dart' show kIsWeb;

class OTPService {
  static String get baseUrl => kIsWeb 
      ? 'http://localhost:3000/api'
      : 'http://192.168.157.67:3000/api';
  static const Duration timeoutDuration = Duration(seconds: 10);

  static Future<Map<String, dynamic>> sendOTP(String email) async {
    try {
      print('🔄 Sending OTP to: $email');
      
      final response = await http.post(
        Uri.parse('$baseUrl/send-otp'),
        headers: {'Content-Type': 'application/json'},
        body: json.encode({'email': email}),
      ).timeout(timeoutDuration);

      print('📡 Response status: ${response.statusCode}');
      print('📡 Response body: ${response.body}');

      if (response.statusCode == 200) {
        return {'success': true, 'message': 'OTP sent successfully! Check your email.'};
      } else {
        final data = json.decode(response.body);
        return {'success': false, 'message': data['message'] ?? 'Failed to send OTP'};
      }
    } catch (e) {
      print('❌ Error sending OTP: $e');
      if (e.toString().contains('TimeoutException')) {
        return {'success': false, 'message': 'Request timeout. Please check if the server is running.'};
      }
      return {'success': false, 'message': 'Network error. Make sure the backend server is running on localhost:3000'};
    }
  }

  static Future<Map<String, dynamic>> verifyOTP(String email, String otp) async {
    try {
      print('🔄 Verifying OTP: $otp for email: $email');
      
      final response = await http.post(
        Uri.parse('$baseUrl/verify-otp'),
        headers: {'Content-Type': 'application/json'},
        body: json.encode({'email': email, 'otp': otp}),
      ).timeout(timeoutDuration);

      print('📡 Response status: ${response.statusCode}');
      print('📡 Response body: ${response.body}');

      if (response.statusCode == 200) {
        final data = json.decode(response.body);
        return {'success': data['success'] ?? true, 'message': data['message'] ?? 'OTP verified successfully!'};
      } else {
        final data = json.decode(response.body);
        return {'success': false, 'message': data['message'] ?? 'Invalid OTP'};
      }
    } catch (e) {
      print('❌ Error verifying OTP: $e');
      if (e.toString().contains('TimeoutException')) {
        return {'success': false, 'message': 'Request timeout. Please check if the server is running.'};
      }
      return {'success': false, 'message': 'Network error. Make sure the backend server is running on localhost:3000'};
    }
  }
}
