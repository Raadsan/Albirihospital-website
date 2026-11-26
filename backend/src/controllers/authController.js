import { prisma } from "../db.js";
import { hashPassword, comparePassword, generateToken } from "../utils/jwt.js";
import { defaultReceptionistPermissions, loadDashboardPermissions, parseDashboardPermissions } from "../utils/dashboardAccess.js";

const publicProfile = { id: true, name: true, email: true, role: true, createdAt: true };
const usersSetupError = {
  success: false,
  error: "Users setup is incomplete. Apply the dashboard permissions migration and regenerate the backend Prisma client.",
};

const MIN_PASSWORD_LENGTH = 12;
const MAX_PASSWORD_BYTES = 72;
const passwordRequirements = "Use at least 12 characters and no more than 72 bytes.";

function validNewPassword(password) {
  return typeof password === "string" &&
    Array.from(password.trim()).length >= MIN_PASSWORD_LENGTH &&
    Buffer.byteLength(password, "utf8") <= MAX_PASSWORD_BYTES;
}

function normalizeProfile(name, email) {
  const normalizedName = typeof name === "string" ? name.trim() : "";
  const normalizedEmail = typeof email === "string" ? email.trim().toLowerCase() : "";
  if (!normalizedName || normalizedName.length > 191 ||
      !/^[^\s@]+@[^\s@]+$/.test(normalizedEmail) || normalizedEmail.length > 191) return null;
  return { name: normalizedName, email: normalizedEmail };
}

const invalidCredentials = {
  success: false,
  error: "Invalid email or password.",
};

// Account provisioning is restricted to admins.
export async function register(req, res) {
  const { name, email, password, role, permissions } = req.body ?? {};
  const profile = normalizeProfile(name, email);
  const requestedRole = typeof role === "string" ? role.trim().toUpperCase() : "";

  if (!profile) {
    return res.status(400).json({ success: false, error: "Enter a valid name and email address." });
  }

  if (!validNewPassword(password)) {
    return res.status(400).json({ success: false, error: passwordRequirements });
  }

  if (requestedRole !== "ADMIN" && requestedRole !== "RECEPTIONIST") {
    return res.status(400).json({ success: false, error: "Choose Admin or Receptionist." });
  }
  const allowed = parseDashboardPermissions(permissions === undefined
    ? (requestedRole === "RECEPTIONIST" ? defaultReceptionistPermissions : [])
    : permissions);
  if (allowed === null) return res.status(400).json({ success: false, error: "Choose valid dashboard sections." });
  if (requestedRole === "RECEPTIONIST" && !prisma.dashboardAccess) {
    return res.status(503).json(usersSetupError);
  }

  try {
    const user = await prisma.user.create({
      data: {
        ...profile,
        password: await hashPassword(password),
        role: requestedRole,
        ...(requestedRole === "RECEPTIONIST" ? { dashboardAccess: { create: { permissions: allowed } } } : {}),
      },
      select: publicProfile,
    });

    return res.status(201).json({ success: true, user: { ...user, permissions: user.role === "ADMIN" ? [] : allowed } });
  } catch (error) {
    if (requestedRole === "RECEPTIONIST" && error.code === "P2021") {
      return res.status(503).json(usersSetupError);
    }
    if (error.code === "P2002") {
      return res.status(409).json({ success: false, error: "This email address is already registered." });
    }
    return res.status(500).json({ success: false, error: "The account could not be created." });
  }
}

export async function listUsers(_req, res) {
  if (!prisma.dashboardAccess) return res.status(503).json(usersSetupError);

  try {
    const [users, grants] = await Promise.all([
      prisma.user.findMany({ select: publicProfile, orderBy: { createdAt: "desc" } }),
      prisma.dashboardAccess.findMany({ select: { userId: true, permissions: true } }),
    ]);
    const byUser = new Map(grants.map(({ userId, permissions }) => [userId, parseDashboardPermissions(permissions) ?? []]));
    return res.json({ success: true, data: users.map((user) => ({ ...user, permissions: byUser.get(user.id) ?? [] })) });
  } catch (error) {
    if (error.code === "P2021") return res.status(503).json(usersSetupError);
    throw error;
  }
}

export async function updateUserPermissions(req, res) {
  const permissions = parseDashboardPermissions(req.body?.permissions);
  if (!permissions) return res.status(400).json({ success: false, error: "Choose valid dashboard sections." });

  const user = await prisma.user.findUnique({ where: { id: req.params.id }, select: publicProfile });
  if (!user) return res.status(404).json({ success: false, error: "User not found." });
  if (user.role !== "RECEPTIONIST") {
    return res.status(400).json({ success: false, error: "Admin accounts have full access." });
  }

  if (!prisma.dashboardAccess) return res.status(503).json(usersSetupError);
  try {
    await prisma.dashboardAccess.upsert({
      where: { userId: user.id },
      create: { userId: user.id, permissions },
      update: { permissions },
    });
  } catch (error) {
    if (error.code === "P2021") return res.status(503).json(usersSetupError);
    throw error;
  }
  return res.json({ success: true, user: { ...user, permissions } });
}

export async function updateUser(req, res) {
  const { id } = req.params;
  const { name, email, password, permissions } = req.body ?? {};
  const profile = normalizeProfile(name, email);
  if (!profile) return res.status(400).json({ success: false, error: "Enter a valid name and email address." });

  if (password !== undefined && !validNewPassword(password)) {
    return res.status(400).json({ success: false, error: passwordRequirements });
  }
  const allowed = permissions === undefined ? undefined : parseDashboardPermissions(permissions);
  if (allowed === null) return res.status(400).json({ success: false, error: "Choose valid dashboard sections." });

  try {
    const target = await prisma.user.findUnique({ where: { id }, select: { id: true, role: true } });
    if (!target) return res.status(404).json({ success: false, error: "User not found." });
    if (password !== undefined && target.id === req.user.id) {
      return res.status(400).json({ success: false, error: "Use Change Password for your own account." });
    }
    if (allowed !== undefined && target.role !== "RECEPTIONIST") {
      return res.status(400).json({ success: false, error: "Admin accounts have full access." });
    }

    const user = await prisma.user.update({
      where: { id: target.id, role: target.role },
      data: {
        ...profile,
        ...(password !== undefined ? { password: await hashPassword(password) } : {}),
        ...(allowed !== undefined ? {
          dashboardAccess: { upsert: { create: { permissions: allowed }, update: { permissions: allowed } } },
        } : {}),
      },
      select: { ...publicProfile, dashboardAccess: { select: { permissions: true } } },
    });
    const { dashboardAccess, ...updatedProfile } = user;
    return res.json({ success: true, user: { ...updatedProfile, permissions: parseDashboardPermissions(dashboardAccess?.permissions) ?? [] } });
  } catch (error) {
    if (error.code === "P2002") return res.status(409).json({ success: false, error: "This email address is already registered." });
    if (error.code === "P2025") return res.status(404).json({ success: false, error: "User not found." });
    if (error.code === "P2021") return res.status(503).json(usersSetupError);
    throw error;
  }
}

export async function deleteUser(req, res) {
  const { id } = req.params;
  try {
    // Keep the actor and target checks in the same transaction as the delete.
    const status = await prisma.$transaction(async (tx) => {
      const actor = await tx.user.findUnique({ where: { id: req.user.id }, select: { id: true, role: true } });
      if (actor?.role !== "ADMIN") return 403;
      const target = await tx.user.findUnique({ where: { id }, select: { id: true } });
      if (!target) return 404;
      if (target.id === actor.id) return 409;
      await tx.user.delete({ where: { id: target.id } });
      return 200;
    }, { isolationLevel: "Serializable" });

    if (status === 403) return res.status(403).json({ success: false, error: "Admin access is required." });
    if (status === 404) return res.status(404).json({ success: false, error: "User not found." });
    if (status === 409) return res.status(409).json({ success: false, error: "You cannot delete the account you are signed in with." });
    return res.json({ success: true, message: "User deleted." });
  } catch (error) {
    if (error.code === "P2025") return res.status(404).json({ success: false, error: "User not found." });
    if (error.code === "P2034") return res.status(409).json({ success: false, error: "The accounts changed during the request. Refresh and try again." });
    throw error;
  }
}

export async function login(req, res) {
  res.set("Cache-Control", "no-store");
  const { email, password } = req.body ?? {};
  const normalizedEmail = typeof email === "string" ? email.trim().toLowerCase() : "";

  if (!normalizedEmail || normalizedEmail.length > 191 ||
      typeof password !== "string" || !password || password.length > 1024) {
    return res.status(400).json({ success: false, error: "Enter your email address and password." });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email: normalizedEmail },
      select: { id: true, name: true, email: true, role: true, password: true, createdAt: true },
    });

    if (!user || !(await comparePassword(password, user.password))) {
      return res.status(401).json(invalidCredentials);
    }

    const permissions = await loadDashboardPermissions(prisma, user);
    if (user.role !== "ADMIN" && !permissions.length) {
      return res.status(403).json({ success: false, error: "Ask an admin to assign your dashboard access." });
    }

    const { password: _password, ...profile } = user;
    return res.status(200).json({
      success: true,
      token: generateToken(user),
      user: { ...profile, permissions },
    });
  } catch {
    return res.status(500).json({ success: false, error: "Sign-in is temporarily unavailable." });
  }
}

export function getMe(req, res) {
  return res.json({ success: true, user: req.user });
}

export async function changePassword(req, res) {
  const { currentPassword, newPassword } = req.body ?? {};

  if (typeof currentPassword !== "string" || !currentPassword || currentPassword.length > 1024) {
    return res.status(400).json({ success: false, error: "Enter your current password." });
  }

  if (!validNewPassword(newPassword)) {
    return res.status(400).json({ success: false, error: passwordRequirements });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: { password: true },
    });

    if (!user || !(await comparePassword(currentPassword, user.password))) {
      return res.status(400).json({ success: false, error: "The current password is incorrect." });
    }

    if (await comparePassword(newPassword, user.password)) {
      return res.status(400).json({ success: false, error: "Choose a password different from your current one." });
    }

    const result = await prisma.user.updateMany({
      where: { id: req.user.id, password: user.password },
      data: { password: await hashPassword(newPassword) },
    });

    if (result.count !== 1) {
      return res.status(409).json({ success: false, error: "The password changed. Sign in and try again." });
    }

    return res.json({ success: true, message: "Password updated. Sign in with your new password." });
  } catch {
    return res.status(500).json({ success: false, error: "The password could not be changed. Try again later." });
  }
}
