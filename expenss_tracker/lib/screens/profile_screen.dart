import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:image_picker/image_picker.dart';
import 'dart:io';
import 'package:flutter/foundation.dart' show kIsWeb;
import 'dart:typed_data';
import 'package:shared_preferences/shared_preferences.dart';
import 'dart:convert';

class ProfileScreen extends StatefulWidget {
  const ProfileScreen({super.key});

  @override
  State<ProfileScreen> createState() => _ProfileScreenState();
}

class _ProfileScreenState extends State<ProfileScreen> {
  final _nameController = TextEditingController();
  final _emailController = TextEditingController();
  final _phoneController = TextEditingController();
  final _budgetController = TextEditingController();
  
  String _currency = 'USD';
  bool _notifications = true;
  bool _darkMode = false;
  File? _profileImage;
  Uint8List? _webImage;
  final ImagePicker _picker = ImagePicker();

  @override
  void initState() {
    super.initState();
    _loadProfileData();
  }

  void _loadProfileData() async {
    final prefs = await SharedPreferences.getInstance();
    
    _nameController.text = prefs.getString('profile_name') ?? '';
    // Get email from login session or saved profile
    String? loginEmail = prefs.getString('user_email') ?? prefs.getString('login_email');
    _emailController.text = loginEmail ?? prefs.getString('profile_email') ?? '';
    _phoneController.text = prefs.getString('profile_phone') ?? '';
    _budgetController.text = prefs.getString('profile_budget') ?? '';
    _currency = prefs.getString('profile_currency') ?? 'USD';
    _notifications = prefs.getBool('profile_notifications') ?? true;
    _darkMode = prefs.getBool('profile_darkmode') ?? false;
    
    // Load saved image
    if (kIsWeb) {
      String? savedImage = prefs.getString('profile_image');
      if (savedImage != null && savedImage.isNotEmpty) {
        try {
          _webImage = base64Decode(savedImage);
        } catch (e) {
          print('Error loading saved image: $e');
        }
      }
    } else {
      String? imagePath = prefs.getString('profile_image_path');
      if (imagePath != null && imagePath.isNotEmpty) {
        File imageFile = File(imagePath);
        if (await imageFile.exists()) {
          _profileImage = imageFile;
        }
      }
    }
    
    setState(() {});
  }

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
                                          _nameController.text.isNotEmpty 
                                              ? _nameController.text.substring(0, 1).toUpperCase()
                                              : 'U',
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
                                          _nameController.text.isNotEmpty 
                                              ? _nameController.text.substring(0, 1).toUpperCase()
                                              : 'U',
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
                    _nameController.text.isNotEmpty ? _nameController.text : 'User Name',
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
                _buildTextField('Monthly Budget', _budgetController, Icons.account_balance_wallet_outlined, prefix: '₹'),
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
                  _saveNotificationSetting(value);
                }),
                _buildSwitchTile('Dark Mode', _darkMode, (value) {
                  setState(() => _darkMode = value);
                  _saveDarkModeSetting(value);
                }),
              ],
            ),

            const SizedBox(height: 20),

            // Quick Stats - Dynamic
            _buildSection(
              'Quick Stats',
              [
                Row(
                  children: [
                    Expanded(child: _buildStatCard('Total Income', '₹0', Colors.green)),
                    const SizedBox(width: 12),
                    Expanded(child: _buildStatCard('Total Expenses', '₹0', Colors.red)),
                  ],
                ),
                const SizedBox(height: 12),
                Row(
                  children: [
                    Expanded(child: _buildStatCard('Savings', '₹0', Colors.blue)),
                    const SizedBox(width: 12),
                    Expanded(child: _buildStatCard('Budget Left', _budgetController.text.isNotEmpty ? '₹${_budgetController.text}' : '₹0', Colors.orange)),
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
                  'Save',
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
        onChanged: (value) {
          setState(() {}); // Update UI when text changes
          // Auto-save specific fields
          if (label == 'Full Name') {
            _saveNameChange(value);
          } else if (label == 'Phone') {
            _savePhoneChange(value);
          } else if (label == 'Monthly Budget') {
            _saveBudgetChange(value);
          }
        },
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
            // Auto-save currency change
            _saveCurrencyChange(newValue);
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
                        // Save image to SharedPreferences
                        final prefs = await SharedPreferences.getInstance();
                        String base64Image = base64Encode(bytes);
                        await prefs.setString('profile_image', base64Image);
                      } else {
                        setState(() {
                          _profileImage = File(image.path);
                        });
                        // Save image path for mobile
                        final prefs = await SharedPreferences.getInstance();
                        await prefs.setString('profile_image_path', image.path);
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
                        // Save image path for mobile
                        final prefs = await SharedPreferences.getInstance();
                        await prefs.setString('profile_image_path', image.path);
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

  void _saveNameChange(String name) async {
    try {
      final prefs = await SharedPreferences.getInstance();
      await prefs.setString('profile_name', name.trim());
    } catch (e) {
      print('Error saving name: $e');
    }
  }

  void _savePhoneChange(String phone) async {
    try {
      final prefs = await SharedPreferences.getInstance();
      await prefs.setString('profile_phone', phone.trim());
    } catch (e) {
      print('Error saving phone: $e');
    }
  }

  void _saveBudgetChange(String budget) async {
    try {
      final prefs = await SharedPreferences.getInstance();
      await prefs.setString('profile_budget', budget.trim());
    } catch (e) {
      print('Error saving budget: $e');
    }
  }

  void _saveNotificationSetting(bool value) async {
    try {
      final prefs = await SharedPreferences.getInstance();
      await prefs.setBool('profile_notifications', value);
    } catch (e) {
      print('Error saving notification setting: $e');
    }
  }

  void _saveDarkModeSetting(bool value) async {
    try {
      final prefs = await SharedPreferences.getInstance();
      await prefs.setBool('profile_darkmode', value);
    } catch (e) {
      print('Error saving dark mode setting: $e');
    }
  }

  void _saveCurrencyChange(String currency) async {
    try {
      final prefs = await SharedPreferences.getInstance();
      await prefs.setString('profile_currency', currency);
    } catch (e) {
      print('Error saving currency: $e');
    }
  }

  void _saveProfile() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      
      // Save all profile data
      await prefs.setString('profile_name', _nameController.text.trim());
      await prefs.setString('profile_email', _emailController.text.trim());
      await prefs.setString('profile_phone', _phoneController.text.trim());
      await prefs.setString('profile_budget', _budgetController.text.trim());
      await prefs.setString('profile_currency', _currency);
      await prefs.setBool('profile_notifications', _notifications);
      await prefs.setBool('profile_darkmode', _darkMode);
      
      // Save image data if exists
      if (kIsWeb && _webImage != null) {
        String base64Image = base64Encode(_webImage!);
        await prefs.setString('profile_image', base64Image);
      } else if (!kIsWeb && _profileImage != null) {
        await prefs.setString('profile_image_path', _profileImage!.path);
      }
      
      // Also save to user_email for login persistence
      if (_emailController.text.trim().isNotEmpty) {
        await prefs.setString('user_email', _emailController.text.trim());
      }
      
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Profile saved successfully! All changes are now permanent.'),
          backgroundColor: Colors.green,
          duration: Duration(seconds: 3),
        ),
      );
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('Error saving profile: $e'),
          backgroundColor: Colors.red,
          duration: const Duration(seconds: 2),
        ),
      );
    }
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