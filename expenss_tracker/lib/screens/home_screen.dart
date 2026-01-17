import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../services/expense_service.dart';
import 'profile_screen.dart';
import 'add_expense_screen.dart';
import 'add_income_screen.dart';
import 'history_screen.dart';
import 'reports_screen.dart';
import 'category_view_screen.dart';
import 'category_detail_screen.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  double totalIncome = 0.0;
  double totalExpenses = 0.0;
  double balance = 0.0;
  bool isLoading = true;
  Map<String, double> categoryExpenses = {};

  @override
  void initState() {
    super.initState();
    _loadData();
  }

  Future<void> _loadData() async {
    final prefs = await SharedPreferences.getInstance();
    final userEmail = prefs.getString('user_email') ?? '';
    
    if (userEmail.isNotEmpty) {
      final balanceResult = await ExpenseService.getBalance(userEmail);
      if (balanceResult['success']) {
        final data = balanceResult['data'];
        setState(() {
          totalIncome = data['totalIncome']?.toDouble() ?? 0.0;
          totalExpenses = data['totalExpenses']?.toDouble() ?? 0.0;
          balance = data['balance']?.toDouble() ?? 0.0;
          isLoading = false;
        });
      }
      
      await _loadCategoryData(userEmail);
    }
  }

  Future<void> _loadCategoryData(String userEmail) async {
    try {
      final response = await ExpenseService.getExpenses(userEmail);
      if (response['success']) {
        final expenses = response['data']['expenses'] as List;
        Map<String, double> categories = {};
        
        for (var expense in expenses) {
          final category = expense['category'] as String;
          final amount = (expense['amount'] as num).toDouble();
          categories[category] = (categories[category] ?? 0) + amount;
        }
        
        setState(() {
          categoryExpenses = categories;
        });
      }
    } catch (e) {
      print('Error loading category data: $e');
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.grey[100],
      body: SafeArea(
        child: RefreshIndicator(
          onRefresh: _loadData,
          child: SingleChildScrollView(
            child: Column(
              children: [
                // Top Purple Section
                Container(
                  padding: const EdgeInsets.all(20),
                  decoration: const BoxDecoration(
                    gradient: LinearGradient(
                      colors: [Color(0xFF6C63FF), Color(0xFF5A52D5)],
                      begin: Alignment.topLeft,
                      end: Alignment.bottomRight,
                    ),
                    borderRadius: BorderRadius.only(
                      bottomLeft: Radius.circular(30),
                      bottomRight: Radius.circular(30),
                    ),
                  ),
                  child: Column(
                    children: [
                      // Header
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Text(
                            'Dashboard',
                            style: GoogleFonts.inter(
                              fontSize: 24,
                              fontWeight: FontWeight.bold,
                              color: Colors.white,
                            ),
                          ),
                          GestureDetector(
                            onTap: () => Navigator.push(
                              context,
                              MaterialPageRoute(builder: (context) => const ProfileScreen()),
                            ),
                            child: CircleAvatar(
                              radius: 18,
                              backgroundColor: Colors.white.withOpacity(0.2),
                              child: const Icon(Icons.person, color: Colors.white, size: 20),
                            ),
                          ),
                        ],
                      ),
                      
                      const SizedBox(height: 20),
                      
                      // Date
                      Align(
                        alignment: Alignment.centerLeft,
                        child: Text(
                          '${DateTime.now().month}/${DateTime.now().year}',
                          style: GoogleFonts.inter(
                            fontSize: 16,
                            color: Colors.white.withOpacity(0.8),
                          ),
                        ),
                      ),
                      
                      const SizedBox(height: 20),
                      
                      // Financial Stats
                      if (isLoading)
                        const CircularProgressIndicator(color: Colors.white)
                      else
                        Row(
                          children: [
                            Expanded(
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Row(
                                    children: [
                                      const Icon(Icons.trending_up, color: Colors.white, size: 16),
                                      const SizedBox(width: 8),
                                      Text(
                                        'Income',
                                        style: GoogleFonts.inter(
                                          fontSize: 14,
                                          color: Colors.white.withOpacity(0.8),
                                        ),
                                      ),
                                    ],
                                  ),
                                  const SizedBox(height: 4),
                                  Text(
                                    '₹${totalIncome.toStringAsFixed(0)}',
                                    style: GoogleFonts.inter(
                                      fontSize: 18,
                                      fontWeight: FontWeight.bold,
                                      color: Colors.white,
                                    ),
                                  ),
                                  const SizedBox(height: 16),
                                  Row(
                                    children: [
                                      const Icon(Icons.trending_down, color: Colors.white, size: 16),
                                      const SizedBox(width: 8),
                                      Text(
                                        'Expenses',
                                        style: GoogleFonts.inter(
                                          fontSize: 14,
                                          color: Colors.white.withOpacity(0.8),
                                        ),
                                      ),
                                    ],
                                  ),
                                  const SizedBox(height: 4),
                                  Text(
                                    '₹${totalExpenses.toStringAsFixed(0)}',
                                    style: GoogleFonts.inter(
                                      fontSize: 18,
                                      fontWeight: FontWeight.bold,
                                      color: Colors.white,
                                    ),
                                  ),
                                  const SizedBox(height: 16),
                                  Row(
                                    children: [
                                      const Icon(Icons.account_balance_wallet, color: Colors.white, size: 16),
                                      const SizedBox(width: 8),
                                      Text(
                                        'Balance',
                                        style: GoogleFonts.inter(
                                          fontSize: 14,
                                          color: Colors.white.withOpacity(0.8),
                                        ),
                                      ),
                                    ],
                                  ),
                                  const SizedBox(height: 4),
                                  Text(
                                    '₹${balance.toStringAsFixed(0)}',
                                    style: GoogleFonts.inter(
                                      fontSize: 18,
                                      fontWeight: FontWeight.bold,
                                      color: Colors.white,
                                    ),
                                  ),
                                ],
                              ),
                            ),
                          ],
                        ),
                    ],
                  ),
                ),
                
                const SizedBox(height: 20),
                
                // Category Breakdown
                Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 20),
                  child: Column(
                    children: [
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Text(
                            'Category Breakdown',
                            style: GoogleFonts.inter(
                              fontSize: 18,
                              fontWeight: FontWeight.w600,
                              color: const Color(0xFF1A1A1A),
                            ),
                          ),
                          GestureDetector(
                            onTap: () => Navigator.push(
                              context,
                              MaterialPageRoute(builder: (context) => const CategoryViewScreen()),
                            ),
                            child: Text(
                              'View All',
                              style: GoogleFonts.inter(
                                fontSize: 14,
                                color: const Color(0xFF6C63FF),
                                fontWeight: FontWeight.w500,
                              ),
                            ),
                          ),
                        ],
                      ),
                      
                      const SizedBox(height: 16),
                      
                      Row(
                        children: [
                          ...categoryExpenses.entries.take(3).map((entry) {
                            return _buildCategoryCard(
                              context, 
                              entry.key, 
                              '₹${entry.value.toStringAsFixed(0)}', 
                              _getCategoryIcon(entry.key), 
                              _getCategoryColor(entry.key)
                            );
                          }).toList(),
                          if (categoryExpenses.length < 3)
                            ...List.generate(3 - categoryExpenses.length, (index) => 
                              _buildCategoryCard(context, 'No Data', '₹0', Icons.category, Colors.grey)
                            ),
                        ],
                      ),
                    ],
                  ),
                ),
                
                const SizedBox(height: 30),
                
                // Quick Actions
                Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 20),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        'Quick Actions',
                        style: GoogleFonts.inter(
                          fontSize: 18,
                          fontWeight: FontWeight.w600,
                          color: const Color(0xFF1A1A1A),
                        ),
                      ),
                      
                      const SizedBox(height: 16),
                      
                      Row(
                        children: [
                          Expanded(
                            child: _buildActionCard(
                              'Add Expense',
                              Icons.remove_circle_outline,
                              const LinearGradient(
                                colors: [Color(0xFFFF6B6B), Color(0xFFEE5A52)],
                                begin: Alignment.topLeft,
                                end: Alignment.bottomRight,
                              ),
                              () => Navigator.push(
                                context,
                                MaterialPageRoute(builder: (context) => const AddExpenseScreen()),
                              ).then((_) => _loadData()),
                            ),
                          ),
                          const SizedBox(width: 16),
                          Expanded(
                            child: _buildActionCard(
                              'Add Income',
                              Icons.add_circle_outline,
                              const LinearGradient(
                                colors: [Color(0xFF2FB344), Color(0xFF27A03D)],
                                begin: Alignment.topLeft,
                                end: Alignment.bottomRight,
                              ),
                              () => Navigator.push(
                                context,
                                MaterialPageRoute(builder: (context) => const AddIncomeScreen()),
                              ).then((_) => _loadData()),
                            ),
                          ),
                        ],
                      ),
                      
                      const SizedBox(height: 16),
                      
                      Row(
                        children: [
                          Expanded(
                            child: _buildActionCard(
                              'History',
                              Icons.history,
                              const LinearGradient(
                                colors: [Color(0xFF339AF0), Color(0xFF228BE6)],
                                begin: Alignment.topLeft,
                                end: Alignment.bottomRight,
                              ),
                              () => Navigator.push(
                                context,
                                MaterialPageRoute(builder: (context) => const HistoryScreen()),
                              ),
                            ),
                          ),
                          const SizedBox(width: 16),
                          Expanded(
                            child: _buildActionCard(
                              'Reports',
                              Icons.bar_chart_rounded,
                              const LinearGradient(
                                colors: [Color(0xFF9775FA), Color(0xFF845EF7)],
                                begin: Alignment.topLeft,
                                end: Alignment.bottomRight,
                              ),
                              () => Navigator.push(
                                context,
                                MaterialPageRoute(builder: (context) => const ReportsScreen()),
                              ),
                            ),
                          ),
                        ],
                      ),
                    ],
                  ),
                ),
                
                const SizedBox(height: 30),
              ],
            ),
          ),
        ),
      ),
    );
  }
  
  Widget _buildCategoryCard(BuildContext context, String title, String amount, IconData icon, Color color) {
    return Expanded(
      child: GestureDetector(
        onTap: () => Navigator.push(
          context,
          MaterialPageRoute(
            builder: (context) => CategoryDetailScreen(
              categoryName: title,
              categoryIcon: icon,
              categoryColor: color,
            ),
          ),
        ),
        child: Container(
          margin: const EdgeInsets.symmetric(horizontal: 4),
          padding: const EdgeInsets.all(16),
          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.circular(16),
            boxShadow: [
              BoxShadow(
                color: Colors.black.withOpacity(0.08),
                blurRadius: 15,
                offset: const Offset(0, 4),
              ),
            ],
          ),
          child: Column(
            children: [
              Container(
                padding: const EdgeInsets.all(14),
                decoration: BoxDecoration(
                  color: color.withOpacity(0.15),
                  shape: BoxShape.circle,
                ),
                child: Icon(icon, color: color, size: 28),
              ),
              const SizedBox(height: 12),
              Text(
                title,
                style: GoogleFonts.inter(
                  fontSize: 13,
                  color: const Color(0xFF6B7280),
                  fontWeight: FontWeight.w500,
                ),
              ),
              const SizedBox(height: 6),
              Text(
                amount,
                style: GoogleFonts.inter(
                  fontSize: 16,
                  fontWeight: FontWeight.bold,
                  color: const Color(0xFF1A1A1A),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
  
  Widget _buildActionCard(String title, IconData icon, Gradient gradient, VoidCallback onTap) {
    return Container(
      height: 90,
      decoration: BoxDecoration(
        gradient: gradient,
        borderRadius: BorderRadius.circular(20),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.15),
            blurRadius: 12,
            offset: const Offset(0, 6),
          ),
        ],
      ),
      child: Material(
        color: Colors.transparent,
        child: InkWell(
          borderRadius: BorderRadius.circular(20),
          onTap: onTap,
          child: Padding(
            padding: const EdgeInsets.all(20),
            child: Row(
              children: [
                Container(
                  padding: const EdgeInsets.all(10),
                  decoration: BoxDecoration(
                    color: Colors.white.withOpacity(0.25),
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: Icon(icon, color: Colors.white, size: 24),
                ),
                const SizedBox(width: 16),
                Expanded(
                  child: Text(
                    title,
                    style: GoogleFonts.inter(
                      fontSize: 16,
                      fontWeight: FontWeight.w600,
                      color: Colors.white,
                    ),
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
  
  IconData _getCategoryIcon(String category) {
    const icons = {
      'Food': Icons.restaurant,
      'Transport': Icons.directions_car,
      'Shopping': Icons.shopping_bag,
      'Medical': Icons.local_hospital,
      'Entertainment': Icons.movie,
      'Bills': Icons.receipt,
      'Education': Icons.school,
      'Personal': Icons.person,
      'Wife': Icons.favorite,
    };
    return icons[category] ?? Icons.category;
  }
  
  Color _getCategoryColor(String category) {
    const colors = {
      'Food': Color(0xFFE53E3E),
      'Transport': Color(0xFF3182CE),
      'Shopping': Color(0xFFD53F8C),
      'Medical': Color(0xFFE53E3E),
      'Entertainment': Color(0xFF9775FA),
      'Bills': Color(0xFFFF6B6B),
      'Education': Color(0xFF51CF66),
      'Personal': Color(0xFF3182CE),
      'Wife': Color(0xFFD53F8C),
    };
    return colors[category] ?? Colors.grey;
  }
}