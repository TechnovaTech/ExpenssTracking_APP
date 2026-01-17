import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../services/expense_service.dart';
import 'category_detail_screen.dart';

class CategoryViewScreen extends StatefulWidget {
  const CategoryViewScreen({super.key});

  @override
  State<CategoryViewScreen> createState() => _CategoryViewScreenState();
}

class _CategoryViewScreenState extends State<CategoryViewScreen> {
  List<Map<String, dynamic>> categories = [];
  bool isLoading = true;

  @override
  void initState() {
    super.initState();
    _loadCategories();
  }

  Future<void> _loadCategories() async {
    const userEmail = 'krimavadodariya07@gmail.com';
    
    try {
      final response = await ExpenseService.getExpenses(userEmail);
      if (response['success']) {
        final expenses = response['data']['expenses'] as List;
        Map<String, double> categoryTotals = {};
        
        for (var expense in expenses) {
          final category = expense['category'] as String;
          final amount = (expense['amount'] as num).toDouble();
          categoryTotals[category] = (categoryTotals[category] ?? 0) + amount;
        }
        
        List<Map<String, dynamic>> categoryList = [];
        categoryTotals.forEach((name, amount) {
          categoryList.add({
            'name': name,
            'amount': '₹${amount.toStringAsFixed(0)}',
            'icon': _getCategoryIcon(name),
            'color': _getCategoryColor(name),
          });
        });
        
        categoryList.sort((a, b) => b['name'].compareTo(a['name']));
        
        setState(() {
          categories = categoryList;
          isLoading = false;
        });
      }
    } catch (e) {
      setState(() => isLoading = false);
    }
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

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.grey[50],
      appBar: AppBar(
        title: Text(
          'Categories',
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
      body: isLoading
          ? const Center(child: CircularProgressIndicator())
          : categories.isEmpty
              ? Center(
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Icon(Icons.category, size: 64, color: Colors.grey[400]),
                      const SizedBox(height: 16),
                      Text(
                        'No categories found',
                        style: GoogleFonts.inter(
                          fontSize: 16,
                          color: Colors.grey[600],
                        ),
                      ),
                    ],
                  ),
                )
              : RefreshIndicator(
                  onRefresh: _loadCategories,
                  child: Padding(
                    padding: const EdgeInsets.all(20),
                    child: GridView.builder(
                      gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                        crossAxisCount: 2,
                        crossAxisSpacing: 16,
                        mainAxisSpacing: 16,
                        childAspectRatio: 0.85,
                      ),
                      itemCount: categories.length,
                      itemBuilder: (context, index) {
                        final category = categories[index];
                        return GestureDetector(
                          onTap: () => Navigator.push(
                            context,
                            MaterialPageRoute(
                              builder: (context) => CategoryDetailScreen(
                                categoryName: category['name'],
                                categoryIcon: category['icon'],
                                categoryColor: category['color'],
                              ),
                            ),
                          ),
                          child: Container(
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
                              mainAxisAlignment: MainAxisAlignment.center,
                              children: [
                                Container(
                                  padding: const EdgeInsets.all(16),
                                  decoration: BoxDecoration(
                                    color: category['color'].withOpacity(0.15),
                                    shape: BoxShape.circle,
                                  ),
                                  child: Icon(
                                    category['icon'],
                                    color: category['color'],
                                    size: 32,
                                  ),
                                ),
                                const SizedBox(height: 16),
                                Text(
                                  category['name'],
                                  style: GoogleFonts.inter(
                                    fontSize: 16,
                                    fontWeight: FontWeight.w600,
                                    color: const Color(0xFF1A1A1A),
                                  ),
                                ),
                                const SizedBox(height: 8),
                                Text(
                                  category['amount'],
                                  style: GoogleFonts.inter(
                                    fontSize: 18,
                                    fontWeight: FontWeight.bold,
                                    color: category['color'],
                                  ),
                                ),
                              ],
                            ),
                          ),
                        );
                      },
                    ),
                  ),
                ),
    );
  }
}