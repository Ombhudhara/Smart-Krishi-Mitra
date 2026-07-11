import jwt from "jsonwebtoken";

/**
 * Generates a JSON Web Token (JWT) for a user payload.
 * 
 * @param {object} payload - The user identity details to encode.
 * @returns {string} The signed JWT token.
 */
export const generateToken = (payload) => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET is missing from environment variables");
  }
  return jwt.sign(payload, secret, {
    expiresIn: "7d",
  });
};

/**
 * Verifies a JSON Web Token (JWT).
 * 
 * @param {string} token - The token to check.
 * @returns {object} The decoded token payload.
 */
export const verifyToken = (token) => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET is missing from environment variables");
  }
  return jwt.verify(token, secret);
};
