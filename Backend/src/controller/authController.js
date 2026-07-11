import User from "../models/User.js";
import { generateToken } from "../utils/jwt.js";

/**
 * Register a new user.
 * POST /api/auth/register
 */
export const register = async (req, res) => {
  try {
    const { 
      fullName, 
      email, 
      phone, 
      password, 
      role, 
      profileImage, 
      state, 
      city, 
      district, 
      village, 
      taluka, 
      pincode, 
      address 
    } = req.body;

    // 1. Basic validation
    if (!fullName || !email || !phone || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields: fullName, email, phone, password.",
      });
    }

    // Clean and normalize input
    const cleanEmail = email.toLowerCase().trim();
    const cleanPhone = phone.trim();

    // Email format validation
    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(cleanEmail)) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid email address.",
      });
    }

    // Password length validation
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters long.",
      });
    }

    // Role validation
    const allowedRoles = ["Farmer", "Vendor", "Customer", "Admin"];
    let finalRole = "Customer";
    if (role) {
      // Capitalize role to match schema values (Farmer, Vendor, Customer, Admin)
      const capitalizedRole = role.charAt(0).toUpperCase() + role.slice(1).toLowerCase();
      if (!allowedRoles.includes(capitalizedRole)) {
        return res.status(400).json({
          success: false,
          message: "Invalid role. Allowed roles are: Farmer, Vendor, Customer, Admin.",
        });
      }
      finalRole = capitalizedRole;
    }

    // 2. Check duplicate Email or Phone
    const existingUserByEmail = await User.findOne({ email: cleanEmail });
    if (existingUserByEmail) {
      return res.status(409).json({
        success: false,
        message: "An account with this email already exists. Please log in.",
      });
    }

    const existingUserByPhone = await User.findOne({ phone: cleanPhone });
    if (existingUserByPhone) {
      return res.status(409).json({
        success: false,
        message: "This phone number is already registered.",
      });
    }

    // 3. Create User (password will be auto-hashed by User model schema pre-save hook)
    const newUser = await User.create({
      fullName: fullName.trim(),
      email: cleanEmail,
      phone: cleanPhone,
      password,
      role: finalRole,
      profileImage: profileImage || "",
      state: state || "",
      district: district || city || "", // Map city to district from frontend
      village: village || "",
      taluka: taluka || "",
      pincode: pincode || "",
      address: address || "",
    });

    // 4. Generate JWT
    const token = generateToken({ id: newUser._id, role: newUser.role });

    // 5. Exclude password from response
    const userResponse = newUser.toObject();
    delete userResponse.password;

    return res.status(201).json({
      success: true,
      message: "User registered successfully.",
      token,
      user: userResponse,
    });
  } catch (error) {
    console.error("Error in registration controller:", error.message || error);
    return res.status(500).json({
      success: false,
      message: "An internal server error occurred during registration.",
    });
  }
};

/**
 * Login user.
 * POST /api/auth/login
 */
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Basic validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please enter both email and password.",
      });
    }

    // Clean and normalize email
    const cleanEmail = email.toLowerCase().trim();

    // 2. Find User
    const user = await User.findOne({ email: cleanEmail });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "No account found with this email. Please register first.",
      });
    }

    if (user.accountStatus !== "Active") {
      return res.status(403).json({
        success: false,
        message: "Your account is suspended or inactive. Please contact support.",
      });
    }

    // 3. Match password
    const isPasswordMatch = await user.comparePassword(password);
    if (!isPasswordMatch) {
      return res.status(401).json({
        success: false,
        message: "Incorrect password. Please try again.",
      });
    }

    // 4. Update lastLogin date
    user.lastLogin = new Date();
    await user.save();

    // 5. Generate Token
    const token = generateToken({ id: user._id, role: user.role });

    // 6. Exclude password from response
    const userResponse = user.toObject();
    delete userResponse.password;

    return res.status(200).json({
      success: true,
      message: "Login successful.",
      token,
      user: userResponse,
    });
  } catch (error) {
    console.error("Error in login controller:", error.message || error);
    return res.status(500).json({
      success: false,
      message: "An internal server error occurred during login.",
    });
  }
};

/**
 * Get current logged in user context.
 * GET /api/auth/me
 */
export const getCurrentUser = async (req, res) => {
  try {
    // req.user has already been populated by authMiddleware (excluding password)
    return res.status(200).json({
      success: true,
      user: req.user,
    });
  } catch (error) {
    console.error("Error in getCurrentUser controller:", error.message || error);
    return res.status(500).json({
      success: false,
      message: "An internal server error occurred retrieving your profile.",
    });
  }
};

/**
 * Logout user.
 * POST /api/auth/logout
 */
export const logout = async (req, res) => {
  try {
    return res.status(200).json({
      success: true,
      message: "Logged out successfully. Please clear the token from your client storage.",
    });
  } catch (error) {
    console.error("Error in logout controller:", error.message || error);
    return res.status(500).json({
      success: false,
      message: "An internal server error occurred during logout.",
    });
  }
};
