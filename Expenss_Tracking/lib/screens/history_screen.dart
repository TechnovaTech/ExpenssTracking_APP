import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

class HistoryScreen extends StatefulWidget {
  const HistoryScreen({super.key});

  @override
  State<HistoryScreen> createState() => _HistoryScreenState();
}

class _HistoryScreenState extends State<HistoryScreen> {
  String _selectedFilter = 'All';
  final List<String> _filters = ['All', 'Income', 'Expense'];

  final List<Map<String, dynamic>> _transactions = [
    {
      'type': 'expense',
      'amount': 1200,
      'category': 'Food',
      'description': 'Lunch at restaurant',
      'date': DateTime.now().subtract(const Duration(hours: 2)),
      'icon': Icons.restaurant,
      'color': const Color(0xFFE74C3C),
    },
    {
      'type': 'income',
      'amount': 50000,
      'category': 'Salary',
      'description': 'Monthly salary',
      'date': DateTime.now().subtract(const Duration(days: 1)),
      'icon': Icons.work,
      'color': const Color(0xFF27AE60),
    },
    {
      'type': 'expense',
      'amount': 800,
      'category': 'Transport',
      'description': 'Uber ride',
      'date': DateTime.now().subtract(const Duration(days: 2)),
      'icon': Icons.directions_car,
      'color': const Color(0xFFE74C3C),
    },
    {
      'type': 'expense',
      'amount': 2500,
      'category': 'Shopping',
      'description': 'Clothes shopping',
      'date': DateTime.now().subtract(const Duration(days: 3)),
      'icon': Icons.shopping_bag,
      'color': const Color(0xFFE74C3C),
    },
    {
      'type': 'income',
      'amount': 15000,
      'category': 'Freelance',
      'description': 'Website project',
      'date': DateTime.now().subtract(const Duration(days: 5)),
      'icon': Icons.laptop,
      'color': const Color(0xFF27AE60),
    },
  ];

  @override
  Widget build(BuildContext context) {
    final filteredTransactions = _selectedFilter == 'All'
        ? _transactions
        : _transactions.where((t) => t['type'] == _selectedFilter.toLowerCase()).toList();

    return Scaffold(
      backgroundColor: const Color(0xFFF8F9FA),
      body: SafeArea(
        child: CustomScrollView(
          slivers: [
            SliverAppBar(
              floating: false,
              pinned: true,
              backgroundColor: Color(0xFF4ECDC4),
              leading: IconButton(
                onPressed: () => Navigator.pop(context),
                icon: Icon(Icons.arrow_back_ios, color: Colors.white),
              ),
              title: Text(
                'Transaction History',
                style: GoogleFonts.poppins(
                  fontSize: 20,
                  fontWeight: FontWeight.bold,
                  color: Colors.white,
                ),
              ),
              flexibleSpace: Container(
                decoration: BoxDecoration(
                  gradient: LinearGradient(
                    colors: [Color(0xFF4ECDC4), Color(0xFF44A3A0)],
                    begin: Alignment.topLeft,
                    end: Alignment.bottomRight,
                  ),
                ),
              ),
            ),
          SliverToBoxAdapter(
            child: Padding(
              padding: const EdgeInsets.all(20),
              child: Column(
                children: [
                  Container(
                    padding: EdgeInsets.all(4),
                    decoration: BoxDecoration(
                      color: Colors.white,
                      borderRadius: BorderRadius.circular(16),
                      boxShadow: [
                        BoxShadow(
                          color: Colors.black.withOpacity(0.05),
                          blurRadius: 10,
                          offset: Offset(0, 4),
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
                              padding: EdgeInsets.symmetric(vertical: 12),
                              decoration: BoxDecoration(
                                color: isSelected ? Color(0xFF4ECDC4) : Colors.transparent,
                                borderRadius: BorderRadius.circular(12),
                              ),
                              child: Text(
                                filter,
                                textAlign: TextAlign.center,
                                style: GoogleFonts.poppins(
                                  fontSize: 14,
                                  fontWeight: FontWeight.w600,
                                  color: isSelected ? Colors.white : Color(0xFF718096),
                                ),
                              ),
                            ),
                          ),
                        );
                      }).toList(),
                    ),
                  ),
                  SizedBox(height: 20),
                  filteredTransactions.isEmpty
                      ? Center(
                          child: Column(
                            children: [
                              SizedBox(height: 60),
                              Icon(Icons.receipt_long, size: 64, color: Colors.grey[400]),
                              SizedBox(height: 16),
                              Text(
                                'No transactions found',
                                style: GoogleFonts.poppins(fontSize: 16, color: Colors.grey[600]),
                              ),
                            ],
                          ),
                        )
                      : ListView.builder(
                          shrinkWrap: true,
                          physics: NeverScrollableScrollPhysics(),
                          itemCount: filteredTransactions.length,
                          itemBuilder: (context, index) {
                            final transaction = filteredTransactions[index];
                            return _buildTransactionCard(transaction);
                          },
                        ),
                ],
              ),
            ),
          ),
        ],
      ),
      ),
    );
  }

  Widget _buildTransactionCard(Map<String, dynamic> transaction) {
    final isIncome = transaction['type'] == 'income';
    
    return Container(
      margin: EdgeInsets.only(bottom: 12),
      padding: EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.05),
            blurRadius: 10,
            offset: Offset(0, 4),
          ),
        ],
      ),
      child: Row(
        children: [
          Container(
            padding: EdgeInsets.all(12),
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
          SizedBox(width: 16),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  transaction['category'],
                  style: GoogleFonts.poppins(
                    fontSize: 16,
                    fontWeight: FontWeight.w600,
                    color: Color(0xFF2D3748),
                  ),
                ),
                SizedBox(height: 4),
                Text(
                  transaction['description'],
                  style: GoogleFonts.poppins(
                    fontSize: 13,
                    color: Color(0xFF718096),
                  ),
                ),
                SizedBox(height: 4),
                Text(
                  _formatDate(transaction['date']),
                  style: GoogleFonts.poppins(
                    fontSize: 12,
                    color: Color(0xFFA0AEC0),
                  ),
                ),
              ],
            ),
          ),
          Text(
            '${isIncome ? '+' : '-'}₹${transaction['amount']}',
            style: GoogleFonts.poppins(
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
