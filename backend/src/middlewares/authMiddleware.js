import { verifyToken } from "../utils/jwt.js";
import { prisma } from "../db.js";

/**
 * Middleware to protect routes and verify JWT token
 */
export async function protect(req, res, next) {
  let token;

  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith("Bearer ")) {
    token = authHeader.split(" ")[1];
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      error: "Ma haysatid ogolaansho (No token provided)",
    });
  }

  try {
    const decoded = verifyToken(token);

    // Get user from database without password
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        error: "User-ka token-kaan leh lama helin (User not found)",
      });
    }

    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      error: "Token-ku waa dhacay ama waa qalad (Invalid or expired token)",
    });
  }
}

/**
 * Middleware to restrict access based on roles
 * @param  {...string} roles - e.g. "ADMIN", "DOCTOR"
 */
export function authorizeRoles(...roles) {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        error: "Ma haysatid awood aad ku gasho boggan (Access denied: insufficient permissions)",
      });
    }
    next();
  };
}
