import "dotenv/config";
import { createHmac } from "node:crypto";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is required for authentication.");
}
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";

// Bind each session to the current password without including the password hash.
export function credentialVersion(passwordHash) {
  return createHmac("sha256", JWT_SECRET)
    .update("albiri-credential-version:")
    .update(passwordHash)
    .digest("base64url");
}

export function generateToken(user) {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role, version: credentialVersion(user.password) },
    JWT_SECRET,
    { algorithm: "HS256", expiresIn: JWT_EXPIRES_IN },
  );
}

/**
 * Verify and decode a JWT token
 * @param {string} token
 * @returns {object} Decoded token payload
 */
export function verifyToken(token) {
  return jwt.verify(token, JWT_SECRET, { algorithms: ["HS256"] });
}

/**
 * Hash plain text password using bcrypt
 * @param {string} password
 * @returns {Promise<string>}
 */
export async function hashPassword(password) {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

/**
 * Compare plain text password with hashed password
 * @param {string} password
 * @param {string} hashedPassword
 * @returns {Promise<boolean>}
 */
export async function comparePassword(password, hashedPassword) {
  return bcrypt.compare(password, hashedPassword);
}
