import { verifyToken } from "../utils/jwt.js";
import User from "../models/User.js";

/**
 * Authentication middleware to protect routes.
 * Verifies the JWT Bearer token and attaches the user object to req.user.
 */
export const authMiddleware = async (req, res, next) => {
  try {
    let token;

    // Retrieve token from Authorization header (Bearer <token>)
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer")) {
      token = authHeader.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Access denied. No authentication token provided.",
      });
    }

    // Verify token
    let decoded;
    try {
      decoded = verifyToken(token);
    } catch (err) {
      return res.status(401).json({
        success: false,
        message: "Invalid or expired token.",
      });
    }

    // Find user in database and exclude password field
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User associated with this token no longer exists.",
      });
    }

    if (user.accountStatus !== "Active") {
      return res.status(401).json({
        success: false,
        message: "User account is suspended or inactive.",
      });
    }

    // Attach user to request object
    req.user = user;
    next();
  } catch (error) {
    console.error("Error in authMiddleware:", error.message || error);
    return res.status(500).json({
      success: false,
      message: "An internal server error occurred during authentication.",
    });
  }
};
export default authMiddleware;
