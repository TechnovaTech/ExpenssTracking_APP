import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:image_picker/image_picker.dart';
import '../services/expense_service.dart';
import 'dart:io';

class AddTransactionScreen extends StatefulWidget {
  final String? categoryName;
  final IconData? categoryIcon;
  final Color? categoryColor;

  const AddTransactionScreen({
    super.key,
    this.categoryName,
    this.categoryIcon,
    this.categoryColor,
  });

  @override
  State<AddTransactionScreen> createState() => _AddTransactionScreenState();
}

class _AddTransactionScreenState extends State<AddTransactionScreen> {
  final _amountController = TextEditingController();
  final _descriptionController = TextEditingController();
  final _categoryController = TextEditingController();
  final _personController = TextEditingController();
  final _paymentMethodController = TextEditingController();
  
  String _transactionType = 'expense';
  DateTime _selectedDate = DateTime.now();
  File? _receiptImage;
  final ImagePicker _picker = ImagePicker();
  
  List<String> _categories = [];
  List<String> _persons = [];
  List<String> _paymentMethods = [];
  bool _isLoading = true;

  @override
  void initState() {
    super.initState();
    if (widget.categoryName != null) {
      _categoryController.text = widget.categoryName!;
    }
    _loadExistingData();
  }

  Future<void> _loadExistingData() async {
    setState(() => _isLoading = true);
    
    const userEmail = 'krimavadodariya07@gmail.com';
    
    try {
      final expenseResult = await ExpenseService.getExpenses(userEmail);
      final incomeResult = await ExpenseService.getIncome(userEmail);
      
      Set<String> categories = {};
      Set<String> persons = {};
      Set<String> paymentMethods = {};
      
      if (expenseResult['success']) {
        final expenses = expenseResult['data']['expenses'] as List;
        for (var expense in expenses) {
          if (expense['category'] != null && expense['category'].toString().isNotEmpty) {
            categories.add(expense['category']);
          }
          if (expense['person'] != null && expense['person'].toString().isNotEmpty) {
            persons.add(expense['person']);
          }
          if (expense['paymentMethod'] != null && expense['paymentMethod'].toString().isNotEmpty) {
            paymentMethods.add(expense['paymentMethod']);
          }
        }
      }
      
      if (incomeResult['success']) {
        final incomes = incomeResult['data']['income'] as List;
        for (var income in incomes) {
          if (income['category'] != null && income['category'].toString().isNotEmpty) {
            categories.add(income['category']);
          }
          if (income['person'] != null && income['person'].toString().isNotEmpty) {
            persons.add(income['person']);
          }
          if (income['paymentMethod'] != null && income['paymentMethod'].toString().isNotEmpty) {
            paymentMethods.add(income['paymentMethod']);
          }
        }
      }
      
      setState(() {
        _categories = categories.toList()..sort();
        _persons = persons.toList()..sort();
        _paymentMethods = paymentMethods.toList()..sort();
        _isLoading = false;
      });
    } catch (e) {
      setState(() => _isLoading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.grey[50],
      appBar: AppBar(
        title: Text(
          'Add Transaction',
          style: GoogleFonts.inter(
            fontWeight: FontWeight.w600,
            color: const Color(0xFF1A1A1A),
          ),
        ),
        backgroundColor: Colors.white,
        elevation: 0,
        centerTitle: true,
        leading: IconButton(
          onPressed: () => Navigator.pop(context),
          icon: const Icon(Icons.arrow_back_ios, color: Color(0xFF6C63FF)),
        ),
      ),
      body: _isLoading
          ? const Center(child: CircularProgressIndicator())
          : SingleChildScrollView(
              padding: const EdgeInsets.all(20),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Transaction Type Toggle
                  Container(
                    padding: const EdgeInsets.all(20),
                    decoration: BoxDecoration(
                      color: Colors.white,
                      borderRadius: BorderRadius.circular(16),
                      boxShadow: [
                        BoxShadow(
                          color: Colors.black.withOpacity(0.05),
                          blurRadius: 10,
                          offset: const Offset(0, 2),
                        ),
                      ],
                    ),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          'Transaction Type',
                          style: GoogleFonts.inter(
                            fontSize: 16,
                            fontWeight: FontWeight.w600,
                            color: const Color(0xFF1A1A1A),
                          ),
                        ),
                        const SizedBox(height: 16),
                        Row(
                          children: [
                            Expanded(
                              child: GestureDetector(
                                onTap: () => setState(() => _transactionType = 'expense'),
                                child: Container(
                                  padding: const EdgeInsets.all(16),
                                  decoration: BoxDecoration(
                                    color: _transactionType == 'expense' 
                                        ? Colors.red.withOpacity(0.1) 
                                        : Colors.grey[100],
                                    borderRadius: BorderRadius.circular(12),
                                    border: Border.all(
                                      color: _transactionType == 'expense' 
                                          ? Colors.red 
                                          : Colors.transparent,
                                      width: 2,
                                    ),
                                  ),
                                  child: Row(
                                    mainAxisAlignment: MainAxisAlignment.center,
                                    children: [
                                      Icon(
                                        Icons.remove_circle_outline,
                                        color: _transactionType == 'expense' 
                                            ? Colors.red 
                                            : Colors.grey[600],
                                      ),
                                      const SizedBox(width: 8),
                                      Text(
                                        'Expense',
                                        style: GoogleFonts.inter(
                                          fontWeight: FontWeight.w600,
                                          color: _transactionType == 'expense' 
                                              ? Colors.red 
                                              : Colors.grey[600],
                                        ),
                                      ),
                                    ],
                                  ),
                                ),
                              ),
                            ),
                            const SizedBox(width: 12),
                            Expanded(
                              child: GestureDetector(
                                onTap: () => setState(() => _transactionType = 'income'),
                                child: Container(
                                  padding: const EdgeInsets.all(16),
                                  decoration: BoxDecoration(
                                    color: _transactionType == 'income' 
                                        ? Colors.green.withOpacity(0.1) 
                                        : Colors.grey[100],
                                    borderRadius: BorderRadius.circular(12),
                                    border: Border.all(
                                      color: _transactionType == 'income' 
                                          ? Colors.green 
                                          : Colors.transparent,
                                      width: 2,
                                    ),
                                  ),
                                  child: Row(
                                    mainAxisAlignment: MainAxisAlignment.center,
                                    children: [
                                      Icon(
                                        Icons.add_circle_outline,
                                        color: _transactionType == 'income' 
                                            ? Colors.green 
                                            : Colors.grey[600],
                                      ),
                                      const SizedBox(width: 8),
                                      Text(
                                        'Income',
                                        style: GoogleFonts.inter(
                                          fontWeight: FontWeight.w600,
                                          color: _transactionType == 'income' 
                                              ? Colors.green 
                                              : Colors.grey[600],
                                        ),
                                      ),
                                    ],
                                  ),
                                ),
                              ),
                            ),
                          ],
                        ),
                      ],
                    ),
                  ),

                  const SizedBox(height: 20),

                  // Transaction Details
                  Container(
                    padding: const EdgeInsets.all(20),
                    decoration: BoxDecoration(
                      color: Colors.white,
                      borderRadius: BorderRadius.circular(16),
                      boxShadow: [
                        BoxShadow(
                          color: Colors.black.withOpacity(0.05),
                          blurRadius: 10,
                          offset: const Offset(0, 2),
                        ),
                      ],
                    ),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          'Transaction Details',
                          style: GoogleFonts.inter(
                            fontSize: 16,
                            fontWeight: FontWeight.w600,
                            color: const Color(0xFF1A1A1A),
                          ),
                        ),
                        const SizedBox(height: 16),
                        
                        // Amount Field
                        TextFormField(
                          controller: _amountController,
                          keyboardType: TextInputType.number,
                          decoration: InputDecoration(
                            labelText: 'Amount *',
                            prefixIcon: const Icon(Icons.currency_rupee),
                            border: OutlineInputBorder(
                              borderRadius: BorderRadius.circular(12),
                            ),
                            focusedBorder: OutlineInputBorder(
                              borderRadius: BorderRadius.circular(12),
                              borderSide: const BorderSide(color: Color(0xFF6C63FF), width: 2),
                            ),
                          ),
                        ),
                        
                        const SizedBox(height: 16),
                        
                        // Category Field
                        _buildAutocompleteField(
                          controller: _categoryController,
                          label: 'Category *',
                          icon: Icons.category,
                          suggestions: _categories,
                        ),
                        
                        const SizedBox(height: 16),
                        
                        // Person Field
                        _buildAutocompleteField(
                          controller: _personController,
                          label: 'Person',
                          icon: Icons.person,
                          suggestions: _persons,
                        ),
                        
                        const SizedBox(height: 16),
                        
                        // Payment Method Field
                        _buildAutocompleteField(
                          controller: _paymentMethodController,
                          label: 'Payment Method',
                          icon: Icons.payment,
                          suggestions: _paymentMethods,
                        ),
                        
                        const SizedBox(height: 16),
                        
                        // Date Field
                        GestureDetector(
                          onTap: _selectDate,
                          child: Container(
                            padding: const EdgeInsets.all(16),
                            decoration: BoxDecoration(
                              border: Border.all(color: Colors.grey[300]!),
                              borderRadius: BorderRadius.circular(12),
                            ),
                            child: Row(
                              children: [
                                const Icon(Icons.calendar_today),
                                const SizedBox(width: 12),
                                Text(
                                  '${_selectedDate.day}/${_selectedDate.month}/${_selectedDate.year}',
                                  style: GoogleFonts.inter(fontSize: 16),
                                ),
                              ],
                            ),
                          ),
                        ),
                        
                        const SizedBox(height: 16),
                        
                        // Description Field
                        TextFormField(
                          controller: _descriptionController,
                          maxLines: 3,
                          decoration: InputDecoration(
                            labelText: 'Description',
                            prefixIcon: const Icon(Icons.note),
                            border: OutlineInputBorder(
                              borderRadius: BorderRadius.circular(12),
                            ),
                            focusedBorder: OutlineInputBorder(
                              borderRadius: BorderRadius.circular(12),
                              borderSide: const BorderSide(color: Color(0xFF6C63FF), width: 2),
                            ),
                          ),
                        ),
                      ],
                    ),
                  ),

                  const SizedBox(height: 30),

                  // Save Button
                  SizedBox(
                    width: double.infinity,
                    height: 50,
                    child: ElevatedButton(
                      onPressed: _saveTransaction,
                      style: ElevatedButton.styleFrom(
                        backgroundColor: const Color(0xFF6C63FF),
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(12),
                        ),
                      ),
                      child: Text(
                        'Save Transaction',
                        style: GoogleFonts.inter(
                          fontSize: 16,
                          fontWeight: FontWeight.w600,
                          color: Colors.white,
                        ),
                      ),
                    ),
                  ),
                ],
              ),
            ),
    );
  }

  Widget _buildAutocompleteField({
    required TextEditingController controller,
    required String label,
    required IconData icon,
    required List<String> suggestions,
  }) {
    return Autocomplete<String>(
      optionsBuilder: (TextEditingValue textEditingValue) {
        if (textEditingValue.text.isEmpty) {
          return suggestions;
        }
        return suggestions.where((String option) {
          return option.toLowerCase().contains(textEditingValue.text.toLowerCase());
        });
      },
      onSelected: (String selection) {
        controller.text = selection;
      },
      fieldViewBuilder: (context, textEditingController, focusNode, onFieldSubmitted) {
        textEditingController.text = controller.text;
        textEditingController.addListener(() {
          controller.text = textEditingController.text;
        });
        
        return TextFormField(
          controller: textEditingController,
          focusNode: focusNode,
          decoration: InputDecoration(
            labelText: label,
            prefixIcon: Icon(icon),
            border: OutlineInputBorder(
              borderRadius: BorderRadius.circular(12),
            ),
            focusedBorder: OutlineInputBorder(
              borderRadius: BorderRadius.circular(12),
              borderSide: const BorderSide(color: Color(0xFF6C63FF), width: 2),
            ),
          ),
        );
      },
    );
  }

  void _selectDate() async {
    final DateTime? picked = await showDatePicker(
      context: context,
      initialDate: _selectedDate,
      firstDate: DateTime(2020),
      lastDate: DateTime.now(),
    );
    if (picked != null && picked != _selectedDate) {
      setState(() => _selectedDate = picked);
    }
  }

  void _saveTransaction() async {
    if (_amountController.text.isEmpty || _categoryController.text.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Please fill amount and category fields')),
      );
      return;
    }

    const userEmail = 'krimavadodariya07@gmail.com';
    final amount = double.tryParse(_amountController.text);
    
    if (amount == null || amount <= 0) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Please enter a valid amount')),
      );
      return;
    }

    try {
      final result = _transactionType == 'expense'
          ? await ExpenseService.addExpense(
              userEmail: userEmail,
              amount: amount,
              category: _categoryController.text,
              person: _personController.text,
              paymentMethod: _paymentMethodController.text,
              description: _descriptionController.text,
              date: _selectedDate.toIso8601String(),
            )
          : await ExpenseService.addIncome(
              userEmail: userEmail,
              amount: amount,
              category: _categoryController.text,
              person: _personController.text,
              paymentMethod: _paymentMethodController.text,
              description: _descriptionController.text,
              date: _selectedDate.toIso8601String(),
            );

      if (result['success']) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('${_transactionType == 'income' ? 'Income' : 'Expense'} added successfully!'),
            backgroundColor: _transactionType == 'income' ? Colors.green : Colors.red,
          ),
        );
        Navigator.pop(context);
      } else {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text(result['message'] ?? 'Failed to save transaction')),
        );
      }
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Error: $e')),
      );
    }
  }

  @override
  void dispose() {
    _amountController.dispose();
    _descriptionController.dispose();
    _categoryController.dispose();
    _personController.dispose();
    _paymentMethodController.dispose();
    super.dispose();
  }
}