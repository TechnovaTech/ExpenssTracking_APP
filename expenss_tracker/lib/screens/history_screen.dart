import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../services/expense_service.dart';

class HistoryScreen extends StatefulWidget {
  const HistoryScreen({super.key});

  @override
  State<HistoryScreen> createState() => _HistoryScreenState();
}

class _HistoryScreenState extends State<HistoryScreen> {
  String _selectedFilter = 'All';
  final List<String> _filters = ['All', 'Income', 'Expense'];
  List<Map<String, dynamic>> _transactions = [];
  bool _isLoading = true;
  double _totalIncome = 0;
  double _totalExpenses = 0;

  @override
  void initState() {
    super.initState();
    _loadTransactions();
  }

  Future<void> _loadTransactions() async {
    setState(() => _isLoading = true);
    
    const userEmail = 'krimavadodariya07@gmail.com';
    
    try {
      final expenseResult = await ExpenseService.getExpenses(userEmail);
      final incomeResult = await ExpenseService.getIncome(userEmail);
      
      print('Expense result: $expenseResult');
      print('Income result: $incomeResult');
      
      List<Map<String, dynamic>> allTransactions = [];
      
      if (expenseResult['success']) {
        final expenses = expenseResult['data']['expenses'] as List;
        print('Expenses count: ${expenses.length}');
        for (var expense in expenses) {
          allTransactions.add({
            'type': 'expense',
            'amount': (expense['amount'] as num).toDouble(),
            'category': expense['category'],
            'description': expense['description'] ?? expense['category'],
            'date': _parseDate(expense['date']),
            'icon': _getCategoryIcon(expense['category'], false),
            'color': const Color(0xFFE53E3E),
          });
        }
      }
      
      if (incomeResult['success']) {
        final incomes = incomeResult['data']['income'] as List;
        print('Income count: ${incomes.length}');
        for (var income in incomes) {
          allTransactions.add({
            'type': 'income',
            'amount': (income['amount'] as num).toDouble(),
            'category': income['category'],
            'description': income['description'] ?? income['category'],
            'date': _parseDate(income['date']),
            'icon': _getCategoryIcon(income['category'], true),
            'color': const Color(0xFF51CF66),
          });
        }
      }
      
      allTransactions.sort((a, b) => b['date'].compareTo(a['date']));
      
      _totalIncome = allTransactions
          .where((t) => t['type'] == 'income')
          .fold(0.0, (sum, t) => sum + (t['amount'] as double));
      
      _totalExpenses = allTransactions
          .where((t) => t['type'] == 'expense')
          .fold(0.0, (sum, t) => sum + (t['amount'] as double));
      
      print('Total transactions: ${allTransactions.length}');
      print('Total income: $_totalIncome');
      print('Total expenses: $_totalExpenses');
      
      setState(() {
        _transactions = allTransactions;
        _isLoading = false;
      });
    } catch (e) {
      print('Error loading transactions: $e');
      setState(() => _isLoading = false);
    }
  }
  
  DateTime _parseDate(dynamic dateValue) {
    try {
      if (dateValue is String) {
        if (dateValue.contains('T')) {
          return DateTime.parse(dateValue);
        } else {
          return DateTime.parse('${dateValue}T00:00:00.000Z');
        }
      }
      return DateTime.now();
    } catch (e) {
      return DateTime.now();
    }
  }
  
  IconData _getCategoryIcon(String category, bool isIncome) {
    if (isIncome) {
      switch (category.toLowerCase()) {
        case 'salary': return Icons.work;
        case 'freelance': return Icons.laptop;
        default: return Icons.account_balance_wallet;
      }
    } else {
      switch (category.toLowerCase()) {
        case 'food': return Icons.restaurant;
        case 'transport': return Icons.directions_car;
        case 'shopping': return Icons.shopping_bag;
        case 'entertainment': return Icons.movie;
        case 'health': return Icons.local_hospital;
        case 'education': return Icons.school;
        default: return Icons.category;
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    final filteredTransactions = _selectedFilter == 'All'
        ? _transactions
        : _transactions.where((t) => t['type'] == _selectedFilter.toLowerCase()).toList();

    return Scaffold(
      backgroundColor: Colors.grey[50],
      appBar: AppBar(
        title: Text(
          'Transaction History',
          style: GoogleFonts.inter(fontWeight: FontWeight.w600),
        ),
        backgroundColor: Colors.white,
        elevation: 0,
        leading: IconButton(
          onPressed: () => Navigator.pop(context),
          icon: const Icon(Icons.arrow_back_ios, color: Color(0xFF6C63FF)),
        ),
      ),
      body: RefreshIndicator(
        onRefresh: _loadTransactions,
        child: Column(
          children: [
            // Filter Tabs
            Container(
              margin: const EdgeInsets.all(20),
              padding: const EdgeInsets.all(4),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(12),
                boxShadow: [
                  BoxShadow(
                    color: Colors.black.withOpacity(0.05),
                    blurRadius: 10,
                    offset: const Offset(0, 2),
                  ),
                ],
              ),
              child: Row(
                children: _filters.map((filter) {
                  final isSelected = filter == _selectedFilter;
                  return Expanded(
                    child: GestureDetector(
                      onTap: () => setState(() => _selectedFilter = filter),
                      child: Container(
                        padding: const EdgeInsets.symmetric(vertical: 12),
                        decoration: BoxDecoration(
                          color: isSelected ? const Color(0xFF6C63FF) : Colors.transparent,
                          borderRadius: BorderRadius.circular(8),
                        ),
                        child: Text(
                          filter,
                          textAlign: TextAlign.center,
                          style: GoogleFonts.inter(
                            fontSize: 14,
                            fontWeight: FontWeight.w500,
                            color: isSelected ? Colors.white : Colors.grey[600],
                          ),
                        ),
                      ),
                    ),
                  );
                }).toList(),
              ),
            ),

            // Summary Cards
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 20),
              child: Row(
                children: [
                  Expanded(
                    child: _buildSummaryCard(
                      'Total Income',
                      '₹${_totalIncome.toStringAsFixed(0)}',
                      Icons.trending_up,
                      const Color(0xFF51CF66),
                    ),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: _buildSummaryCard(
                      'Total Expense',
                      '₹${_totalExpenses.toStringAsFixed(0)}',
                      Icons.trending_down,
                      const Color(0xFFE53E3E),
                    ),
                  ),
                ],
              ),
            ),

            const SizedBox(height: 20),

            // Transactions List
            Expanded(
              child: _isLoading
                  ? const Center(child: CircularProgressIndicator())
                  : filteredTransactions.isEmpty
                  ? Center(
                      child: Column(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          Icon(
                            Icons.receipt_long,
                            size: 64,
                            color: Colors.grey[400],
                          ),
                          const SizedBox(height: 16),
                          Text(
                            'No transactions found',
                            style: GoogleFonts.inter(
                              fontSize: 16,
                              color: Colors.grey[600],
                            ),
                          ),
                        ],
                      ),
                    )
                  : ListView.builder(
                      padding: const EdgeInsets.symmetric(horizontal: 20),
                      itemCount: filteredTransactions.length,
                      itemBuilder: (context, index) {
                        final transaction = filteredTransactions[index];
                        return _buildTransactionCard(transaction);
                      },
                    ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildSummaryCard(String title, String amount, IconData icon, Color color) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(12),
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
          Row(
            children: [
              Icon(icon, color: color, size: 20),
              const SizedBox(width: 8),
              Text(
                title,
                style: GoogleFonts.inter(
                  fontSize: 12,
                  color: Colors.grey[600],
                ),
              ),
            ],
          ),
          const SizedBox(height: 8),
          Text(
            amount,
            style: GoogleFonts.inter(
              fontSize: 18,
              fontWeight: FontWeight.bold,
              color: color,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildTransactionCard(Map<String, dynamic> transaction) {
    final isIncome = transaction['type'] == 'income';
    
    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(12),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.05),
            blurRadius: 8,
            offset: const Offset(0, 2),
          ),
        ],
      ),
      child: Row(
        children: [
          // Icon
          Container(
            padding: const EdgeInsets.all(12),
            decoration: BoxDecoration(
              color: transaction['color'].withOpacity(0.1),
              borderRadius: BorderRadius.circular(12),
            ),
            child: Icon(
              transaction['icon'],
              color: transaction['color'],
              size: 24,
            ),
          ),
          
          const SizedBox(width: 16),
          
          // Details
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  transaction['category'],
                  style: GoogleFonts.inter(
                    fontSize: 16,
                    fontWeight: FontWeight.w600,
                    color: const Color(0xFF1A1A1A),
                  ),
                ),
                const SizedBox(height: 4),
                Text(
                  transaction['description'],
                  style: GoogleFonts.inter(
                    fontSize: 14,
                    color: Colors.grey[600],
                  ),
                ),
                const SizedBox(height: 4),
                Text(
                  _formatDate(transaction['date']),
                  style: GoogleFonts.inter(
                    fontSize: 12,
                    color: Colors.grey[500],
                  ),
                ),
              ],
            ),
          ),
          
          // Amount
          Text(
            '${isIncome ? '+' : '-'}₹${transaction['amount']}',
            style: GoogleFonts.inter(
              fontSize: 16,
              fontWeight: FontWeight.bold,
              color: transaction['color'],
            ),
          ),
        ],
      ),
    );
  }

  String _formatDate(DateTime date) {
    final now = DateTime.now();
    final difference = now.difference(date);
    
    if (difference.inDays == 0) {
      return 'Today';
    } else if (difference.inDays == 1) {
      return 'Yesterday';
    } else if (difference.inDays < 7) {
      return '${difference.inDays} days ago';
    } else {
      return '${date.day}/${date.month}/${date.year}';
    }
  }
}