import { credentialVersion, verifyToken } from "../utils/jwt.js";
import { prisma } from "../db.js";

function unauthorized(res) {
  return res.status(401).json({
    success: false,
    error: "Please sign in with a valid session.",
  });
}

export async function protect(req, res, next) {
  res.set("Cache-Control", "private, no-store");
  const token = /^Bearer ([^\s]+)$/i.exec(req.headers.authorization ?? "")?.[1];
  if (!token) return unauthorized(res);

  let claims;
  try {
    claims = verifyToken(token);
  } catch {
    return unauthorized(res);
  }

  if (typeof claims?.id !== "string" || typeof claims.version !== "string") {
    return unauthorized(res);
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: claims.id },
      select: { id: true, name: true, email: true, role: true, createdAt: true, password: true },
    });

    if (!user || claims.version !== credentialVersion(user.password)) {
      return unauthorized(res);
    }

    const { password, ...profile } = user;
    req.user = profile;
    next();
  } catch (error) {
    next(error);
  }
}

export function authorizeRoles(...roles) {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        error: "Forbidden: You do not have permission to access this resource.",
      });
    }
    next();
  };
}

export function requireAdminForDrafts(req, res, next) {
  if (req.query.all !== "true") return next();
  return protect(req, res, () => authorizeRoles("ADMIN")(req, res, next));
}
