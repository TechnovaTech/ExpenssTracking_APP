import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:image_picker/image_picker.dart';
import 'package:file_picker/file_picker.dart';
import 'dart:io';

class AddIncomeScreen extends StatefulWidget {
  const AddIncomeScreen({super.key});

  @override
  State<AddIncomeScreen> createState() => _AddIncomeScreenState();
}

class _AddIncomeScreenState extends State<AddIncomeScreen> {
  final _amountController = TextEditingController();
  final _noteController = TextEditingController();
  final _amountFocusNode = FocusNode();
  final _noteFocusNode = FocusNode();
  String _selectedCategory = 'Salary';
  String _selectedPaymentMethod = 'Cash';
  String _selectedPerson = 'Self';
  DateTime _selectedDate = DateTime.now();
  File? _uploadedImage;
  String? _uploadedDocument;
  final ImagePicker _picker = ImagePicker();

  final List<String> _categories = [
    'Salary', 'Freelance', 'Business', 'Investment', 'Bonus', 
    'Gift', 'Rental', 'Other'
  ];

  final List<String> _paymentMethods = ['Cash', 'Online', 'Credit Card'];
  final List<String> _persons = ['Self', 'Child', 'Spouse'];

  final Map<String, IconData> _categoryIcons = {
    'Salary': Icons.work,
    'Freelance': Icons.laptop,
    'Business': Icons.business,
    'Investment': Icons.trending_up,
    'Bonus': Icons.card_giftcard,
    'Gift': Icons.redeem,
    'Rental': Icons.home,
    'Other': Icons.attach_money,
  };

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: () {
        // Unfocus all text fields when tapping outside
        FocusScope.of(context).unfocus();
      },
      child: Scaffold(
        backgroundColor: Colors.grey[50],
        resizeToAvoidBottomInset: true,
        appBar: AppBar(
        title: Text(
          'Add Income',
          style: GoogleFonts.inter(fontWeight: FontWeight.w600),
        ),
        backgroundColor: Colors.white,
        elevation: 0,
        leading: IconButton(
          onPressed: () => Navigator.pop(context),
          icon: const Icon(Icons.arrow_back_ios, color: Color(0xFF6C63FF)),
        ),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // 1. Amount Input
            _buildSection(
              'Amount',
              TextField(
                controller: _amountController,
                focusNode: _amountFocusNode,
                keyboardType: TextInputType.number,
                textInputAction: TextInputAction.next,
                onSubmitted: (_) => FocusScope.of(context).requestFocus(_noteFocusNode),
                style: GoogleFonts.inter(
                  fontSize: 32,
                  fontWeight: FontWeight.bold,
                  color: const Color(0xFF51CF66),
                ),
                decoration: InputDecoration(
                  prefixText: '₹ ',
                  prefixStyle: GoogleFonts.inter(
                    fontSize: 32,
                    fontWeight: FontWeight.bold,
                    color: const Color(0xFF51CF66),
                  ),
                  hintText: '0',
                  border: InputBorder.none,
                  hintStyle: GoogleFonts.inter(
                    fontSize: 32,
                    color: Colors.grey[400],
                  ),
                ),
              ),
            ),

            const SizedBox(height: 20),

            // 2. Category Selection
            _buildSection(
              'Category',
              Wrap(
                spacing: 12,
                runSpacing: 12,
                children: _categories.map((category) {
                  final isSelected = category == _selectedCategory;
                  return GestureDetector(
                    onTap: () => setState(() => _selectedCategory = category),
                    child: Container(
                      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                      decoration: BoxDecoration(
                        color: isSelected ? const Color(0xFF51CF66) : Colors.grey[100],
                        borderRadius: BorderRadius.circular(12),
                      ),
                      child: Row(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          Icon(
                            _categoryIcons[category],
                            size: 18,
                            color: isSelected ? Colors.white : Colors.grey[600],
                          ),
                          const SizedBox(width: 8),
                          Text(
                            category,
                            style: GoogleFonts.inter(
                              fontSize: 14,
                              fontWeight: FontWeight.w500,
                              color: isSelected ? Colors.white : Colors.grey[600],
                            ),
                          ),
                        ],
                      ),
                    ),
                  );
                }).toList(),
              ),
            ),

            const SizedBox(height: 20),

            // 3. Payment Method
            _buildSection(
              'Payment Method',
              Row(
                children: _paymentMethods.map((method) {
                  final isSelected = method == _selectedPaymentMethod;
                  return Expanded(
                    child: GestureDetector(
                      onTap: () => setState(() => _selectedPaymentMethod = method),
                      child: Container(
                        margin: const EdgeInsets.only(right: 8),
                        padding: const EdgeInsets.symmetric(vertical: 12),
                        decoration: BoxDecoration(
                          color: isSelected ? const Color(0xFF51CF66) : Colors.grey[100],
                          borderRadius: BorderRadius.circular(12),
                        ),
                        child: Text(
                          method,
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

            const SizedBox(height: 20),

            // 4. Person
            _buildSection(
              'Person',
              Row(
                children: _persons.map((person) {
                  final isSelected = person == _selectedPerson;
                  return Expanded(
                    child: GestureDetector(
                      onTap: () => setState(() => _selectedPerson = person),
                      child: Container(
                        margin: const EdgeInsets.only(right: 8),
                        padding: const EdgeInsets.symmetric(vertical: 12),
                        decoration: BoxDecoration(
                          color: isSelected ? const Color(0xFF51CF66) : Colors.grey[100],
                          borderRadius: BorderRadius.circular(12),
                        ),
                        child: Text(
                          person,
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

            const SizedBox(height: 20),

            // 5. Date Selection
            _buildSection(
              'Date',
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text(
                    '${_selectedDate.day}/${_selectedDate.month}/${_selectedDate.year}',
                    style: GoogleFonts.inter(
                      fontSize: 16,
                      color: const Color(0xFF1A1A1A),
                    ),
                  ),
                  IconButton(
                    onPressed: () async {
                      final date = await showDatePicker(
                        context: context,
                        initialDate: _selectedDate,
                        firstDate: DateTime(2020),
                        lastDate: DateTime.now(),
                      );
                      if (date != null) {
                        setState(() => _selectedDate = date);
                      }
                    },
                    icon: const Icon(Icons.calendar_today, color: Color(0xFF51CF66)),
                  ),
                ],
              ),
            ),

            const SizedBox(height: 20),

            // 6. Note
            _buildSection(
              'Note',
              TextField(
                controller: _noteController,
                focusNode: _noteFocusNode,
                maxLines: 3,
                textInputAction: TextInputAction.done,
                onSubmitted: (_) => FocusScope.of(context).unfocus(),
                decoration: InputDecoration(
                  hintText: 'Add a note about this income...',
                  border: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(12),
                    borderSide: BorderSide(color: Colors.grey[300]!),
                  ),
                  focusedBorder: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(12),
                    borderSide: const BorderSide(color: Color(0xFF51CF66), width: 2),
                  ),
                ),
              ),
            ),

            const SizedBox(height: 20),

            // 7. Upload Files
            _buildSection(
              'Upload Files',
              Column(
                children: [
                  // Image Upload
                  GestureDetector(
                    onTap: _uploadImage,
                    child: Container(
                      width: double.infinity,
                      padding: const EdgeInsets.all(16),
                      decoration: BoxDecoration(
                        border: Border.all(color: Colors.grey[400]!, width: 2),
                        borderRadius: BorderRadius.circular(12),
                        color: Colors.grey[50],
                      ),
                      child: _uploadedImage != null
                          ? Column(
                              children: [
                                ClipRRect(
                                  borderRadius: BorderRadius.circular(8),
                                  child: Image.file(
                                    _uploadedImage!,
                                    height: 100,
                                    width: double.infinity,
                                    fit: BoxFit.cover,
                                  ),
                                ),
                                const SizedBox(height: 8),
                                Text(
                                  'Image uploaded',
                                  style: GoogleFonts.inter(
                                    color: Colors.green,
                                    fontWeight: FontWeight.w500,
                                  ),
                                ),
                              ],
                            )
                          : Row(
                              mainAxisAlignment: MainAxisAlignment.center,
                              children: [
                                const Icon(Icons.camera_alt, color: Colors.grey),
                                const SizedBox(width: 8),
                                Text(
                                  'Upload Image',
                                  style: GoogleFonts.inter(
                                    fontSize: 16,
                                    color: Colors.grey[600],
                                  ),
                                ),
                              ],
                            ),
                    ),
                  ),
                  
                  const SizedBox(height: 12),
                  
                  // Document Upload
                  GestureDetector(
                    onTap: _uploadDocument,
                    child: Container(
                      width: double.infinity,
                      padding: const EdgeInsets.all(16),
                      decoration: BoxDecoration(
                        border: Border.all(color: Colors.grey[400]!, width: 2),
                        borderRadius: BorderRadius.circular(12),
                        color: Colors.grey[50],
                      ),
                      child: Row(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          Icon(
                            _uploadedDocument != null ? Icons.check_circle : Icons.description,
                            color: _uploadedDocument != null ? Colors.green : Colors.grey,
                          ),
                          const SizedBox(width: 8),
                          Expanded(
                            child: Text(
                              _uploadedDocument ?? 'Upload Document',
                              style: GoogleFonts.inter(
                                fontSize: 16,
                                color: _uploadedDocument != null ? Colors.green : Colors.grey[600],
                              ),
                              textAlign: TextAlign.center,
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),
                ],
              ),
            ),

            const SizedBox(height: 40),

            // Save Button
            SizedBox(
              width: double.infinity,
              height: 56,
              child: ElevatedButton(
                onPressed: _saveIncome,
                style: ElevatedButton.styleFrom(
                  backgroundColor: const Color(0xFF51CF66),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(16),
                  ),
                ),
                child: Text(
                  'Add Income',
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

  Widget _buildSection(String title, Widget child) {
    return Container(
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
            title,
            style: GoogleFonts.inter(
              fontSize: 16,
              fontWeight: FontWeight.w600,
              color: const Color(0xFF1A1A1A),
            ),
          ),
          const SizedBox(height: 12),
          child,
        ],
      ),
    );
  }

  void _uploadImage() async {
    final XFile? image = await _picker.pickImage(source: ImageSource.gallery);
    if (image != null) {
      setState(() {
        _uploadedImage = File(image.path);
      });
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Image uploaded successfully!')),
      );
    }
  }

  void _uploadDocument() async {
    FilePickerResult? result = await FilePicker.platform.pickFiles(
      type: FileType.custom,
      allowedExtensions: ['pdf', 'doc', 'docx', 'txt'],
    );
    
    if (result != null) {
      setState(() {
        _uploadedDocument = result.files.single.name;
      });
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Document uploaded successfully!')),
      );
    }
  }

  void _uploadReceipt() {
    // Legacy method - can be removed
  }

  void _saveIncome() {
    if (_amountController.text.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Please enter an amount')),
      );
      return;
    }

    // Save income logic here
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(content: Text('Income added successfully!')),
    );
    Navigator.pop(context);
  }

  @override
  void dispose() {
    _amountController.dispose();
    _noteController.dispose();
    _amountFocusNode.dispose();
    _noteFocusNode.dispose();
    super.dispose();
  }
}