import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'category_detail_screen.dart';

class CategoryViewScreen extends StatelessWidget {
  const CategoryViewScreen({super.key});

  final List<Map<String, dynamic>> categories = const [
    {'name': 'Medical', 'amount': '₹2,450', 'icon': Icons.local_hospital, 'color': Color(0xFFE53E3E)},
    {'name': 'Personal', 'amount': '₹3,200', 'icon': Icons.person, 'color': Color(0xFF3182CE)},
    {'name': 'Wife', 'amount': '₹4,800', 'icon': Icons.favorite, 'color': Color(0xFFD53F8C)},
    {'name': 'Food', 'amount': '₹5,600', 'icon': Icons.restaurant, 'color': Color(0xFFFF8C00)},
    {'name': 'Transport', 'amount': '₹1,800', 'icon': Icons.directions_car, 'color': Color(0xFF32CD32)},
    {'name': 'Shopping', 'amount': '₹7,200', 'icon': Icons.shopping_bag, 'color': Color(0xFF9370DB)},
    {'name': 'Bills', 'amount': '₹3,400', 'icon': Icons.receipt, 'color': Color(0xFFFF6347)},
    {'name': 'Entertainment', 'amount': '₹2,100', 'icon': Icons.movie, 'color': Color(0xFF20B2AA)},
  ];

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
      body: Padding(
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
    );
  }
}