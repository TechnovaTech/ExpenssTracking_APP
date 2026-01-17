import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:flutter/foundation.dart' show kIsWeb;

class ExpenseService {
  static String get baseUrl => kIsWeb 
      ? 'http://localhost:3000/api'
      : 'http://192.168.157.67:3000/api';
  static const Duration timeoutDuration = Duration(seconds: 10);

  static Future<Map<String, dynamic>> addExpense({
    required String userEmail,
    required double amount,
    required String category,
    String? person,
    String? paymentMethod,
    String? description,
    required String date,
  }) async {
    try {
      final response = await http.post(
        Uri.parse('$baseUrl/expenses'),
        headers: {'Content-Type': 'application/json'},
        body: json.encode({
          'userEmail': userEmail,
          'amount': amount,
          'category': category,
          'person': person ?? '',
          'paymentMethod': paymentMethod ?? '',
          'description': description ?? '',
          'date': date,
          'type': 'expense'
        }),
      ).timeout(timeoutDuration);

      if (response.statusCode == 200) {
        return {'success': true, 'message': 'Expense added successfully!'};
      } else {
        final data = json.decode(response.body);
        return {'success': false, 'message': data['message'] ?? 'Failed to add expense'};
      }
    } catch (e) {
      return {'success': false, 'message': 'Network error: $e'};
    }
  }

  static Future<Map<String, dynamic>> addIncome({
    required String userEmail,
    required double amount,
    required String category,
    String? person,
    String? paymentMethod,
    String? description,
    required String date,
  }) async {
    try {
      final response = await http.post(
        Uri.parse('$baseUrl/income'),
        headers: {'Content-Type': 'application/json'},
        body: json.encode({
          'userEmail': userEmail,
          'amount': amount,
          'category': category,
          'person': person ?? '',
          'paymentMethod': paymentMethod ?? '',
          'description': description ?? '',
          'date': date,
          'type': 'income'
        }),
      ).timeout(timeoutDuration);

      if (response.statusCode == 200) {
        return {'success': true, 'message': 'Income added successfully!'};
      } else {
        final data = json.decode(response.body);
        return {'success': false, 'message': data['message'] ?? 'Failed to add income'};
      }
    } catch (e) {
      return {'success': false, 'message': 'Network error: $e'};
    }
  }

  static Future<Map<String, dynamic>> getBalance(String userEmail) async {
    try {
      final response = await http.get(
        Uri.parse('$baseUrl/balance?userEmail=$userEmail'),
        headers: {'Content-Type': 'application/json'},
      ).timeout(timeoutDuration);

      if (response.statusCode == 200) {
        final data = json.decode(response.body);
        return {'success': true, 'data': data};
      } else {
        return {'success': false, 'message': 'Failed to get balance'};
      }
    } catch (e) {
      return {'success': false, 'message': 'Network error: $e'};
    }
  }

  static Future<Map<String, dynamic>> getExpenses(String userEmail) async {
    try {
      final response = await http.get(
        Uri.parse('$baseUrl/expenses?userEmail=$userEmail'),
        headers: {'Content-Type': 'application/json'},
      ).timeout(timeoutDuration);

      if (response.statusCode == 200) {
        final data = json.decode(response.body);
        return {'success': true, 'data': data};
      } else {
        return {'success': false, 'message': 'Failed to get expenses'};
      }
    } catch (e) {
      return {'success': false, 'message': 'Network error: $e'};
    }
  }

  static Future<Map<String, dynamic>> getIncome(String userEmail) async {
    try {
      final response = await http.get(
        Uri.parse('$baseUrl/income?userEmail=$userEmail'),
        headers: {'Content-Type': 'application/json'},
      ).timeout(timeoutDuration);

      if (response.statusCode == 200) {
        final data = json.decode(response.body);
        return {'success': true, 'data': data};
      } else {
        return {'success': false, 'message': 'Failed to get income'};
      }
    } catch (e) {
      return {'success': false, 'message': 'Network error: $e'};
    }
  }
}