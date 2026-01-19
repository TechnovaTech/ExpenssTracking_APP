import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:image_picker/image_picker.dart';
import 'dart:io';
import 'package:flutter/foundation.dart' show kIsWeb;
import 'dart:typed_data';

class ProfileScreen extends StatefulWidget {
  const ProfileScreen({super.key});

  @override
  State<ProfileScreen> createState() => _ProfileScreenState();
}

class _ProfileScreenState extends State<ProfileScreen> {
  final _nameController = TextEditingController(text: 'John Doe');
  final _emailController = TextEditingController(text: 'john.doe@email.com');
  final _phoneController = TextEditingController(text: '+1 234 567 8900');
  final _budgetController = TextEditingController(text: '5000');
  
  String _currency = 'USD';
  bool _notifications = true;
  bool _darkMode = false;
  File? _profileImage;
  Uint8List? _webImage;
  final ImagePicker _picker = ImagePicker();

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.grey[50],
      appBar: AppBar(
        title: Text(
          'Profile',
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
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(20),
        child: Column(
          children: [
            // Profile Picture Section
            Container(
              padding: const EdgeInsets.all(24),
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
                children: [
                  Stack(
                    children: [
                      Container(
                        width: 100,
                        height: 100,
                        decoration: BoxDecoration(
                          shape: BoxShape.circle,
                          border: Border.all(
                            color: const Color(0xFF6C63FF),
                            width: 3,
                          ),
                        ),
                        child: ClipOval(
                          child: kIsWeb
                              ? (_webImage != null
                                  ? Image.memory(
                                      _webImage!,
                                      width: 94,
                                      height: 94,
                                      fit: BoxFit.cover,
                                    )
                                  : Container(
                                      width: 94,
                                      height: 94,
                                      color: Colors.grey[200],
                                      child: Center(
                                        child: Text(
                                          'JD',
                                          style: GoogleFonts.inter(
                                            fontSize: 24,
                                            fontWeight: FontWeight.bold,
                                            color: const Color(0xFF6C63FF),
                                          ),
                                        ),
                                      ),
                                    ))
                              : (_profileImage != null
                                  ? Image.file(
                                      _profileImage!,
                                      width: 94,
                                      height: 94,
                                      fit: BoxFit.cover,
                                    )
                                  : Container(
                                      width: 94,
                                      height: 94,
                                      color: Colors.grey[200],
                                      child: Center(
                                        child: Text(
                                          'JD',
                                          style: GoogleFonts.inter(
                                            fontSize: 24,
                                            fontWeight: FontWeight.bold,
                                            color: const Color(0xFF6C63FF),
                                          ),
                                        ),
                                      ),
                                    )),
                        ),
                      ),
                      Positioned(
                        bottom: 0,
                        right: 0,
                        child: GestureDetector(
                          onTap: _pickProfileImage,
                          child: Container(
                            padding: const EdgeInsets.all(8),
                            decoration: const BoxDecoration(
                              color: Color(0xFF6C63FF),
                              shape: BoxShape.circle,
                            ),
                            child: const Icon(
                              Icons.camera_alt,
                              color: Colors.white,
                              size: 16,
                            ),
                          ),
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 16),
                  Text(
                    'John Doe',
                    style: GoogleFonts.inter(
                      fontSize: 20,
                      fontWeight: FontWeight.w600,
                      color: const Color(0xFF1A1A1A),
                    ),
                  ),
                  Text(
                    'Premium Member',
                    style: GoogleFonts.inter(
                      fontSize: 14,
                      color: const Color(0xFF6C63FF),
                    ),
                  ),
                ],
              ),
            ),

            const SizedBox(height: 20),

            // Personal Information
            _buildSection(
              'Personal Information',
              [
                _buildTextField('Full Name', _nameController, Icons.person_outline),
                _buildTextField('Email', _emailController, Icons.email_outlined),
                _buildTextField('Phone', _phoneController, Icons.phone_outlined),
              ],
            ),

            const SizedBox(height: 20),

            // Financial Settings
            _buildSection(
              'Financial Settings',
              [
                _buildTextField('Monthly Budget', _budgetController, Icons.account_balance_wallet_outlined, prefix: '\$'),
                _buildDropdown('Currency', _currency, ['USD', 'EUR', 'GBP', 'INR'], Icons.attach_money),
              ],
            ),

            const SizedBox(height: 20),

            // App Settings
            _buildSection(
              'App Settings',
              [
                _buildSwitchTile('Push Notifications', _notifications, (value) {
                  setState(() => _notifications = value);
                }),
                _buildSwitchTile('Dark Mode', _darkMode, (value) {
                  setState(() => _darkMode = value);
                }),
              ],
            ),

            const SizedBox(height: 20),

            // Quick Stats
            _buildSection(
              'Quick Stats',
              [
                Row(
                  children: [
                    Expanded(child: _buildStatCard('Total Income', '\$12,450', Colors.green)),
                    const SizedBox(width: 12),
                    Expanded(child: _buildStatCard('Total Expenses', '\$8,230', Colors.red)),
                  ],
                ),
                const SizedBox(height: 12),
                Row(
                  children: [
                    Expanded(child: _buildStatCard('Savings', '\$4,220', Colors.blue)),
                    const SizedBox(width: 12),
                    Expanded(child: _buildStatCard('Budget Left', '\$1,770', Colors.orange)),
                  ],
                ),
              ],
            ),

            const SizedBox(height: 20),

            // Action Buttons
            _buildSection(
              'Actions',
              [
                _buildActionTile('Export Data', Icons.download, () {}),
                _buildActionTile('Backup & Sync', Icons.cloud_upload, () {}),
                _buildActionTile('Help & Support', Icons.help_outline, () {}),
                _buildActionTile('Logout', Icons.logout, () {}, isDestructive: true),
              ],
            ),

            const SizedBox(height: 40),

            // Save Button
            SizedBox(
              width: double.infinity,
              height: 50,
              child: ElevatedButton(
                onPressed: _saveProfile,
                style: ElevatedButton.styleFrom(
                  backgroundColor: const Color(0xFF6C63FF),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(12),
                  ),
                ),
                child: Text(
                  'Save Changes',
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

  Widget _buildSection(String title, List<Widget> children) {
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
          const SizedBox(height: 16),
          ...children,
        ],
      ),
    );
  }

  Widget _buildTextField(String label, TextEditingController controller, IconData icon, {String? prefix}) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 16),
      child: TextFormField(
        controller: controller,
        decoration: InputDecoration(
          labelText: label,
          prefixIcon: Icon(icon, color: const Color(0xFF6C63FF)),
          prefixText: prefix,
          border: OutlineInputBorder(
            borderRadius: BorderRadius.circular(12),
            borderSide: const BorderSide(color: Color(0xFFE5E7EB)),
          ),
          focusedBorder: OutlineInputBorder(
            borderRadius: BorderRadius.circular(12),
            borderSide: const BorderSide(color: Color(0xFF6C63FF), width: 2),
          ),
        ),
      ),
    );
  }

  Widget _buildDropdown(String label, String value, List<String> items, IconData icon) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 16),
      child: DropdownButtonFormField<String>(
        value: value,
        decoration: InputDecoration(
          labelText: label,
          prefixIcon: Icon(icon, color: const Color(0xFF6C63FF)),
          border: OutlineInputBorder(
            borderRadius: BorderRadius.circular(12),
            borderSide: const BorderSide(color: Color(0xFFE5E7EB)),
          ),
          focusedBorder: OutlineInputBorder(
            borderRadius: BorderRadius.circular(12),
            borderSide: const BorderSide(color: Color(0xFF6C63FF), width: 2),
          ),
        ),
        items: items.map((String item) {
          return DropdownMenuItem<String>(
            value: item,
            child: Text(item),
          );
        }).toList(),
        onChanged: (String? newValue) {
          if (newValue != null) {
            setState(() {
              _currency = newValue;
            });
          }
        },
      ),
    );
  }

  Widget _buildSwitchTile(String title, bool value, Function(bool) onChanged) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 16),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(
            title,
            style: GoogleFonts.inter(
              fontSize: 16,
              color: const Color(0xFF1A1A1A),
            ),
          ),
          Switch(
            value: value,
            onChanged: onChanged,
            activeColor: const Color(0xFF6C63FF),
          ),
        ],
      ),
    );
  }

  Widget _buildStatCard(String title, String amount, Color color) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: color.withOpacity(0.1),
        borderRadius: BorderRadius.circular(12),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            title,
            style: GoogleFonts.inter(
              fontSize: 12,
              color: color,
              fontWeight: FontWeight.w500,
            ),
          ),
          const SizedBox(height: 4),
          Text(
            amount,
            style: GoogleFonts.inter(
              fontSize: 16,
              fontWeight: FontWeight.bold,
              color: color,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildActionTile(String title, IconData icon, VoidCallback onTap, {bool isDestructive = false}) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 12),
      child: ListTile(
        leading: Icon(
          icon,
          color: isDestructive ? Colors.red : const Color(0xFF6C63FF),
        ),
        title: Text(
          title,
          style: GoogleFonts.inter(
            fontSize: 16,
            color: isDestructive ? Colors.red : const Color(0xFF1A1A1A),
          ),
        ),
        trailing: const Icon(Icons.arrow_forward_ios, size: 16),
        onTap: onTap,
      ),
    );
  }

  void _pickProfileImage() async {
    try {
      showModalBottomSheet(
        context: context,
        builder: (BuildContext context) {
          return SafeArea(
            child: Wrap(
              children: [
                ListTile(
                  leading: const Icon(Icons.photo_library),
                  title: const Text('Gallery'),
                  onTap: () async {
                    Navigator.pop(context);
                    final XFile? image = await _picker.pickImage(
                      source: ImageSource.gallery,
                      imageQuality: 80,
                      maxWidth: 512,
                      maxHeight: 512,
                    );
                    if (image != null) {
                      if (kIsWeb) {
                        final bytes = await image.readAsBytes();
                        setState(() {
                          _webImage = bytes;
                        });
                      } else {
                        setState(() {
                          _profileImage = File(image.path);
                        });
                      }
                    }
                  },
                ),
                if (!kIsWeb)
                  ListTile(
                    leading: const Icon(Icons.camera_alt),
                    title: const Text('Camera'),
                    onTap: () async {
                      Navigator.pop(context);
                      final XFile? image = await _picker.pickImage(
                        source: ImageSource.camera,
                        imageQuality: 80,
                        maxWidth: 512,
                        maxHeight: 512,
                      );
                      if (image != null) {
                        setState(() {
                          _profileImage = File(image.path);
                        });
                      }
                    },
                  ),
              ],
            ),
          );
        },
      );
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('Error picking image: $e'),
          backgroundColor: Colors.red,
        ),
      );
    }
  }

  void _saveProfile() {
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(
        content: Text('Profile updated successfully!'),
        backgroundColor: Colors.green,
      ),
    );
  }

  @override
  void dispose() {
    _nameController.dispose();
    _emailController.dispose();
    _phoneController.dispose();
    _budgetController.dispose();
    super.dispose();
  }
}