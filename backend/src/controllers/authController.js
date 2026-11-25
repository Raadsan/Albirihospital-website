import { prisma } from "../db.js";
import { hashPassword, comparePassword, generateToken } from "../utils/jwt.js";

const MIN_PASSWORD_LENGTH = 12;
const MAX_PASSWORD_BYTES = 72;
const passwordRequirements = "Use at least 12 characters and no more than 72 bytes.";
const roles = ["ADMIN", "RECEPTIONIST"];

function validNewPassword(password) {
  return typeof password === "string" &&
    Array.from(password.trim()).length >= MIN_PASSWORD_LENGTH &&
    Buffer.byteLength(password, "utf8") <= MAX_PASSWORD_BYTES;
}

const invalidCredentials = {
  success: false,
  error: "Invalid email or password.",
};

// An authorized admin provisions staff accounts.
export async function register(req, res) {
  const { name, email, password, role = "RECEPTIONIST" } = req.body ?? {};
  const normalizedEmail = typeof email === "string" ? email.trim().toLowerCase() : "";
  const normalizedName = typeof name === "string" ? name.trim() : "";
  const requestedRole = typeof role === "string" ? role.trim().toUpperCase() : "";

  if (!normalizedName || normalizedName.length > 191 ||
      !/^[^\s@]+@[^\s@]+$/.test(normalizedEmail) || normalizedEmail.length > 191) {
    return res.status(400).json({ success: false, error: "Enter a valid name and email address." });
  }

  if (!validNewPassword(password)) {
    return res.status(400).json({ success: false, error: passwordRequirements });
  }

  if (!roles.includes(requestedRole)) {
    return res.status(400).json({ success: false, error: "Choose an Admin or Receptionist role." });
  }

  try {
    const user = await prisma.user.create({
      data: {
        name: normalizedName,
        email: normalizedEmail,
        password: await hashPassword(password),
        role: requestedRole,
      },
      select: { id: true, name: true, email: true, role: true, createdAt: true },
    });

    return res.status(201).json({ success: true, user });
  } catch (error) {
    if (error.code === "P2002") {
      return res.status(409).json({ success: false, error: "This email address is already registered." });
    }
    return res.status(500).json({ success: false, error: "The account could not be created." });
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

    const { password: _password, ...profile } = user;
    return res.status(200).json({
      success: true,
      token: generateToken(user),
      user: profile,
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
