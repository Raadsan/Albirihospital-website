import { prisma } from "../db.js";
import { hashPassword, comparePassword, generateToken } from "../utils/jwt.js";

/**
 * @desc    Register a new user (Admin/Doctor/Staff)
 * @route   POST /api/auth/register
 * @access  Public
 */
export async function register(req, res) {
  try {
    const { name, email, password, role } = req.body;

    // Validation
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        error: "Name, email, and password are required.",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        error: "Password must be at least 6 characters long.",
      });
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        error: "This email address is already registered.",
      });
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Allowed roles in Albiri Hospital system: ADMIN or RECEPTIONIST
    const validRoles = ["ADMIN", "RECEPTIONIST"];
    const requestedRole = role ? role.toUpperCase().trim() : "RECEPTIONIST";

    if (role && !validRoles.includes(requestedRole)) {
      return res.status(400).json({
        success: false,
        error: "User role must be either ADMIN or RECEPTIONIST.",
      });
    }

    const userRole = requestedRole;

    // Create user in MySQL
    const user = await prisma.user.create({
      data: {
        name: name.trim(),
        email: normalizedEmail,
        password: hashedPassword,
        role: userRole,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });

    // Generate JWT Token
    const token = generateToken({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    return res.status(201).json({
      success: true,
      message: "User registered successfully.",
      token,
      user,
    });
  } catch (error) {
    console.error("Register Error:", error);
    return res.status(500).json({
      success: false,
      error: "An internal server error occurred during registration. Please try again.",
    });
  }
}

/**
 * @desc    Login user & get token
 * @route   POST /api/auth/login
 * @access  Public
 */
export async function login(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: "Email and password are required.",
      });
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        error: "Invalid email or password.",
      });
    }

    // Verify password
    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        error: "Invalid email or password.",
      });
    }

    // Generate JWT Token
    const token = generateToken({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    return res.status(200).json({
      success: true,
      message: "Login successful.",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error("Login Error:", error);
    return res.status(500).json({
      success: false,
      error: "Server error during login. Please try again later.",
    });
  }
}

/**
 * @desc    Get currently logged in user profile
 * @route   GET /api/auth/me
 * @access  Private (Protected by JWT)
 */
export async function getMe(req, res) {
  try {
    // req.user was already set by protect middleware
    return res.status(200).json({
      success: true,
      user: req.user,
    });
  } catch (error) {
    console.error("GetMe Error:", error);
    return res.status(500).json({
      success: false,
      error: "Server error retrieving profile.",
    });
  }
}
