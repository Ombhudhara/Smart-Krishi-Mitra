import User from "../models/User.js";
import bcrypt from "bcryptjs";
import { uploadSingle } from "../middleware/uploadMiddleware.js";

// Helper for structured success response
const sendSuccess = (res, message, data = {}) => {
  return res.status(200).json({
    success: true,
    message,
    data,
    user: data // Compatible with frontend response.data.user expectation
  });
};

// Helper for structured error response
const sendError = (res, statusCode, message, errors = []) => {
  return res.status(statusCode).json({
    success: false,
    message,
    errors: Array.isArray(errors) ? errors : [errors]
  });
};

/**
 * 1. Get My Profile
 * GET /api/profile
 */
export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    if (!user) {
      return sendError(res, 404, "User not found.");
    }
    return sendSuccess(res, "Profile retrieved successfully", user);
  } catch (error) {
    console.error("Error in getProfile controller:", error.message || error);
    return sendError(res, 500, "Server error retrieving profile.");
  }
};

/**
 * 2. Update Profile
 * PUT /api/profile
 */
export const updateProfile = async (req, res) => {
  try {
    const {
      fullName,
      phone,
      gender,
      dob,
      address,
      state,
      city,
      district,
      village,
      taluka,
      pincode,
      farmName,
      farmSize,
      soilType,
      cropsGrown,
      preferredLanguage,
      profileImage,
      notificationSettings
    } = req.body;

    const errors = [];

    // 1. Validation Checks
    if (fullName !== undefined) {
      const cleanName = fullName.trim();
      if (cleanName.length < 2) {
        errors.push("Full name must be at least 2 characters long.");
      }
      if (cleanName.length > 100) {
        errors.push("Full name cannot exceed 100 characters.");
      }
    }

    if (phone !== undefined) {
      const cleanPhone = phone.trim();
      const phoneRegex = /^\+?[0-9]{10,15}$/;
      if (!phoneRegex.test(cleanPhone)) {
        errors.push("Please provide a valid phone number (10-15 digits).");
      } else {
        const duplicatePhone = await User.findOne({ phone: cleanPhone, _id: { $ne: req.user._id } });
        if (duplicatePhone) {
          errors.push("This phone number is already registered to another account.");
        }
      }
    }

    if (gender !== undefined) {
      if (!["Male", "Female", "Other", "Prefer not to say", ""].includes(gender)) {
        errors.push("Invalid gender selection.");
      }
    }

    if (pincode !== undefined) {
      const cleanPin = String(pincode).trim();
      if (cleanPin && !/^[0-9]{6}$/.test(cleanPin)) {
        errors.push("Pincode must be exactly 6 digits.");
      }
    }

    if (preferredLanguage !== undefined) {
      if (!["English", "Hindi", "Gujarati"].includes(preferredLanguage)) {
        errors.push("Preferred language must be English, Hindi, or Gujarati.");
      }
    }

    if (errors.length > 0) {
      return sendError(res, 400, "Validation failed", errors);
    }

    // 2. Build Update Object
    const updateData = {};
    if (fullName !== undefined) updateData.fullName = fullName.trim();
    if (phone !== undefined) updateData.phone = phone.trim();
    if (gender !== undefined) updateData.gender = gender;
    if (dob !== undefined) updateData.dob = dob;
    if (address !== undefined) updateData.address = address.trim();
    if (state !== undefined) updateData.state = state.trim();
    if (district !== undefined || city !== undefined) {
      updateData.district = (district || city || "").trim();
    }
    if (village !== undefined) updateData.village = village.trim();
    if (taluka !== undefined) updateData.taluka = taluka.trim();
    if (pincode !== undefined) updateData.pincode = String(pincode).trim();
    if (farmName !== undefined) updateData.farmName = farmName.trim();
    if (farmSize !== undefined) updateData.farmSize = String(farmSize).trim();
    if (soilType !== undefined) updateData.soilType = soilType.trim();
    if (cropsGrown !== undefined) {
      updateData.cropsGrown = Array.isArray(cropsGrown) 
        ? cropsGrown 
        : cropsGrown.split(",").map(c => c.trim()).filter(Boolean);
    }
    if (preferredLanguage !== undefined) updateData.preferredLanguage = preferredLanguage;
    if (profileImage !== undefined) updateData.profileImage = profileImage;

    // Map notification settings if provided
    if (notificationSettings !== undefined) {
      const currentNotifs = req.user.notificationSettings || {};
      updateData.notificationSettings = {
        emailAlerts: notificationSettings.emailAlerts !== undefined ? notificationSettings.emailAlerts : (notificationSettings.emailNotifications !== undefined ? notificationSettings.emailNotifications : currentNotifs.emailAlerts),
        smsAlerts: notificationSettings.smsAlerts !== undefined ? notificationSettings.smsAlerts : (notificationSettings.pushNotifications !== undefined ? notificationSettings.pushNotifications : currentNotifs.smsAlerts),
        weatherAlerts: notificationSettings.weatherAlerts !== undefined ? notificationSettings.weatherAlerts : (notificationSettings.aiRecommendations !== undefined ? notificationSettings.aiRecommendations : currentNotifs.weatherAlerts)
      };
    }

    // 3. Update User
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { $set: updateData },
      { new: true, runValidators: true }
    ).select("-password");

    return sendSuccess(res, "Profile updated successfully.", updatedUser);
  } catch (error) {
    console.error("Error in updateProfile controller:", error.message || error);
    return sendError(res, 500, "Server error updating profile.");
  }
};

/**
 * 3. Update Profile Image
 * PUT /api/profile/image
 */
export const updateProfileImage = (req, res) => {
  uploadSingle(req, res, async (err) => {
    if (err) {
      return sendError(res, 400, "Image upload failed", [err.message]);
    }

    if (!req.file) {
      return sendError(res, 400, "Validation failed", ["No image file provided or unsupported file type."]);
    }

    try {
      const imageUrl = `/uploads/${req.file.filename}`;
      const user = await User.findByIdAndUpdate(
        req.user._id,
        { $set: { profileImage: imageUrl } },
        { new: true }
      ).select("-password");

      return sendSuccess(res, "Profile image updated successfully.", user);
    } catch (error) {
      console.error("Error in updateProfileImage controller:", error.message || error);
      return sendError(res, 500, "Server error updating profile image.");
    }
  });
};

/**
 * 4. Change Password
 * PUT /api/profile/password
 */
export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      return sendError(res, 400, "Both current and new passwords are required");
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      return sendError(res, 404, "User not found");
    }

    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return sendError(res, 401, "Incorrect current password");
    }

    if (newPassword.length < 6) {
      return sendError(res, 400, "New password must be at least 6 characters long");
    }

    user.password = newPassword;
    await user.save();

    return sendSuccess(res, "Password updated successfully");
  } catch (error) {
    console.error("Error in changePassword:", error);
    return sendError(res, 500, "Server error updating password");
  }
};

/**
 * 5. Update Preferred Language
 * PUT /api/profile/language
 */
export const changeLanguage = async (req, res) => {
  try {
    const { language } = req.body;
    if (!language) {
      return sendError(res, 400, "Language selection is required.");
    }

    const cleanLanguage = language.trim();
    if (!["English", "Hindi", "Gujarati"].includes(cleanLanguage)) {
      return sendError(res, 400, "Unsupported language preference. Choose from: English, Hindi, Gujarati.");
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $set: { preferredLanguage: cleanLanguage } },
      { new: true }
    ).select("-password");

    return sendSuccess(res, "Language updated successfully", user);
  } catch (error) {
    console.error("Error in changeLanguage:", error);
    return sendError(res, 500, "Server error updating language preference");
  }
};

/**
 * 6. Update Notification Settings
 * PUT /api/profile/notifications
 */
export const updateNotificationSettings = async (req, res) => {
  try {
    const {
      weatherAlerts,
      marketplaceNotifications,
      governmentSchemeUpdates,
      messages,
      transactionAlerts,
      aiRecommendations,
      emailNotifications,
      pushNotifications,
      emailAlerts,
      smsAlerts
    } = req.body;

    const currentNotifs = req.user.notificationSettings || {};

    const updatedNotifs = {
      emailAlerts: emailAlerts !== undefined ? emailAlerts : (emailNotifications !== undefined ? emailNotifications : currentNotifs.emailAlerts),
      smsAlerts: smsAlerts !== undefined ? smsAlerts : (pushNotifications !== undefined ? pushNotifications : currentNotifs.smsAlerts),
      weatherAlerts: weatherAlerts !== undefined ? weatherAlerts : (aiRecommendations !== undefined ? aiRecommendations : currentNotifs.weatherAlerts)
    };

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $set: { notificationSettings: updatedNotifs } },
      { new: true }
    ).select("-password");

    return sendSuccess(res, "Notification preferences updated successfully", user);
  } catch (error) {
    console.error("Error in updateNotificationSettings:", error);
    return sendError(res, 500, "Server error updating notification settings");
  }
};

/**
 * 7. Delete Profile Image
 * DELETE /api/profile/image
 */
export const deleteProfileImage = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $set: { profileImage: "" } },
      { new: true }
    ).select("-password");

    return sendSuccess(res, "Profile image removed successfully.", user);
  } catch (error) {
    console.error("Error in deleteProfileImage controller:", error.message || error);
    return sendError(res, 500, "Server error removing profile image.");
  }
};

/**
 * 8. Account Information
 * GET /api/profile/account
 */
export const getAccountInfo = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return sendError(res, 404, "User not found.");
    }

    const accountData = {
      role: user.role,
      memberSince: user.createdAt,
      lastLogin: user.lastLogin,
      accountStatus: user.accountStatus,
      emailVerified: user.emailVerified,
      phoneVerified: user.phoneVerified
    };

    return sendSuccess(res, "Account details retrieved successfully", accountData);
  } catch (error) {
    console.error("Error in getAccountInfo controller:", error.message || error);
    return sendError(res, 500, "Server error retrieving account details.");
  }
};

/**
 * Toggle bookmarking of a scheme or news article.
 * POST /api/bookmarks
 */
export const toggleBookmark = async (req, res) => {
  try {
    const { id, type } = req.body;
    if (!id || !type) {
      return sendError(res, 400, "ID and type are required.");
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      return sendError(res, 404, "User not found.");
    }

    if (!user.bookmarks) {
      user.bookmarks = [];
    }

    const bookmarkKey = `${type}:${id}`;
    const exists = user.bookmarks.includes(bookmarkKey);

    if (exists) {
      user.bookmarks = user.bookmarks.filter((b) => b !== bookmarkKey);
    } else {
      user.bookmarks.push(bookmarkKey);
    }

    await user.save();

    return res.status(200).json({
      success: true,
      message: exists ? "Removed from bookmarks." : "Added to bookmarks.",
      bookmarks: user.bookmarks,
    });
  } catch (error) {
    console.error("Error in toggleBookmark:", error);
    return sendError(res, 500, "Server error saving bookmark.");
  }
};

/**
 * Get all bookmarks.
 * GET /api/bookmarks
 */
export const getBookmarks = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return sendError(res, 404, "User not found.");
    }

    return res.status(200).json({ success: true, bookmarks: user.bookmarks || [] });
  } catch (error) {
    console.error("Error in getBookmarks:", error);
    return sendError(res, 500, "Server error retrieving bookmarks.");
  }
};
