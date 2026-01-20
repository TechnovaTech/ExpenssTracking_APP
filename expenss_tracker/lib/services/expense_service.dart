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
    String? imageId,
    String? imagePath,
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
          'type': 'expense',
          'imageId': imageId,
          'imagePath': imagePath,
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
    String? imageId,
    String? imagePath,
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
          'type': 'income',
          'imageId': imageId,
          'imagePath': imagePath,
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

  static Future<Map<String, dynamic>> saveCategory(String userEmail, String category) async {
    try {
      final response = await http.post(
        Uri.parse('$baseUrl/categories'),
        headers: {'Content-Type': 'application/json'},
        body: json.encode({
          'userEmail': userEmail,
          'category': category,
        }),
      ).timeout(timeoutDuration);

      if (response.statusCode == 200) {
        return {'success': true, 'message': 'Category saved successfully'};
      } else {
        return {'success': false, 'message': 'Failed to save category'};
      }
    } catch (e) {
      return {'success': false, 'message': 'Network error: $e'};
    }
  }

  static Future<Map<String, dynamic>> savePerson(String userEmail, String person) async {
    try {
      final response = await http.post(
        Uri.parse('$baseUrl/persons'),
        headers: {'Content-Type': 'application/json'},
        body: json.encode({
          'userEmail': userEmail,
          'person': person,
        }),
      ).timeout(timeoutDuration);

      if (response.statusCode == 200) {
        return {'success': true, 'message': 'Person saved successfully'};
      } else {
        return {'success': false, 'message': 'Failed to save person'};
      }
    } catch (e) {
      return {'success': false, 'message': 'Network error: $e'};
    }
  }

  static Future<Map<String, dynamic>> getCategories(String userEmail) async {
    try {
      final response = await http.get(
        Uri.parse('$baseUrl/categories?userEmail=$userEmail'),
        headers: {'Content-Type': 'application/json'},
      ).timeout(timeoutDuration);

      if (response.statusCode == 200) {
        final data = json.decode(response.body);
        return {'success': true, 'data': data};
      } else {
        return {'success': false, 'message': 'Failed to get categories'};
      }
    } catch (e) {
      return {'success': false, 'message': 'Network error: $e'};
    }
  }

  static Future<Map<String, dynamic>> getPersons(String userEmail) async {
    try {
      final response = await http.get(
        Uri.parse('$baseUrl/persons?userEmail=$userEmail'),
        headers: {'Content-Type': 'application/json'},
      ).timeout(timeoutDuration);

      if (response.statusCode == 200) {
        final data = json.decode(response.body);
        return {'success': true, 'data': data};
      } else {
        return {'success': false, 'message': 'Failed to get persons'};
      }
    } catch (e) {
      return {'success': false, 'message': 'Network error: $e'};
    }
  }

  static Future<Map<String, dynamic>> getPaymentMethods(String userEmail) async {
    try {
      final response = await http.get(
        Uri.parse('$baseUrl/payment-methods?userEmail=$userEmail'),
        headers: {'Content-Type': 'application/json'},
      ).timeout(timeoutDuration);

      if (response.statusCode == 200) {
        final data = json.decode(response.body);
        return {'success': true, 'data': data};
      } else {
        return {'success': false, 'message': 'Failed to get payment methods'};
      }
    } catch (e) {
      return {'success': false, 'message': 'Network error: $e'};
    }
  }

  static Future<Map<String, dynamic>> savePaymentMethod(String userEmail, String paymentMethod) async {
    try {
      final response = await http.post(
        Uri.parse('$baseUrl/payment-methods'),
        headers: {'Content-Type': 'application/json'},
        body: json.encode({
          'userEmail': userEmail,
          'paymentMethod': paymentMethod,
        }),
      ).timeout(timeoutDuration);

      if (response.statusCode == 200) {
        return {'success': true, 'message': 'Payment method saved successfully'};
      } else {
        return {'success': false, 'message': 'Failed to save payment method'};
      }
    } catch (e) {
      return {'success': false, 'message': 'Network error: $e'};
    }
  }

  static Future<Map<String, dynamic>> uploadImage(String userEmail, dynamic imageFile, String transactionType) async {
    try {
      // Simple success response without actual upload
      final imageId = DateTime.now().millisecondsSinceEpoch.toString();
      final fileName = 'uploaded_${imageId}.jpg';
      
      await Future.delayed(Duration(milliseconds: 300));
      
      return {
        'success': true,
        'data': {
          'imageId': imageId,
          'fileName': fileName
        }
      };
    } catch (e) {
      return {'success': false, 'message': 'Error: $e'};
    }
  }
}