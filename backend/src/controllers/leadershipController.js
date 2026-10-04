import { prisma } from "../db.js";

/**
 * @desc    Get all leadership team members
 * @route   GET /api/leadership
 * @access  Public
 */
export async function getLeadership(req, res) {
  try {
    const { available } = req.query;
    const where = {};

    if (available !== undefined) {
      where.available = available === "true";
    }

    const leaders = await prisma.leadershipes.findMany({
      where,
      orderBy: [{ order: "asc" }, { createdAt: "asc" }],
    });

    return res.status(200).json({
      success: true,
      count: leaders.length,
      data: leaders,
    });
  } catch (error) {
    console.error("Get Leadership Error:", error);
    return res.status(500).json({
      success: false,
      error: "Failed to retrieve leadership members.",
    });
  }
}

/**
 * @desc    Get leadership member by ID
 * @route   GET /api/leadership/:id
 * @access  Public
 */
export async function getLeadershipById(req, res) {
  try {
    const { id } = req.params;
    const leader = await prisma.leadershipes.findUnique({
      where: { id },
    });

    if (!leader) {
      return res.status(404).json({
        success: false,
        error: "Leadership member not found.",
      });
    }

    return res.status(200).json({
      success: true,
      data: leader,
    });
  } catch (error) {
    console.error("Get Leadership Member Error:", error);
    return res.status(500).json({
      success: false,
      error: "Failed to retrieve member details.",
    });
  }
}

/**
 * @desc    Create new leadership member
 * @route   POST /api/leadership
 * @access  Private (ADMIN only)
 */
export async function createLeadership(req, res) {
  try {
    const {
      name,
      title,
      role,
      specialty = "Hospital Leadership",
      badge = "Executive",
      image,
      details,
      experience,
      education,
      order = 0,
      available = true,
    } = req.body;

    if (!name || !title || !image) {
      return res.status(400).json({
        success: false,
        error: "Name, title, and image are required.",
      });
    }

    const leader = await prisma.leadershipes.create({
      data: {
        name: name.trim(),
        title: title.trim(),
        role: role ? role.trim() : title.trim(),
        specialty: specialty.trim(),
        badge: badge.trim(),
        image: image.trim(),
        details: details ? details.trim() : null,
        experience: experience ? experience.trim() : null,
        education: education ? education.trim() : null,
        order: Number(order) || 0,
        available: Boolean(available),
      },
    });

    return res.status(201).json({
      success: true,
      message: "Leadership member added successfully.",
      data: leader,
    });
  } catch (error) {
    console.error("Create Leadership Error:", error);
    return res.status(500).json({
      success: false,
      error: "Failed to create leadership record.",
    });
  }
}

/**
 * @desc    Update leadership member
 * @route   PATCH /api/leadership/:id
 * @access  Private (ADMIN only)
 */
export async function updateLeadership(req, res) {
  try {
    const { id } = req.params;
    const data = { ...req.body };

    if (data.order !== undefined) {
      data.order = Number(data.order);
    }
    if (data.available !== undefined) {
      data.available = Boolean(data.available);
    }

    const updated = await prisma.leadershipes.update({
      where: { id },
      data,
    });

    return res.status(200).json({
      success: true,
      message: "Leadership member updated successfully.",
      data: updated,
    });
  } catch (error) {
    console.error("Update Leadership Error:", error);
    return res.status(500).json({
      success: false,
      error: "Failed to update leadership record.",
    });
  }
}

/**
 * @desc    Delete leadership member
 * @route   DELETE /api/leadership/:id
 * @access  Private (ADMIN only)
 */
export async function deleteLeadership(req, res) {
  try {
    const { id } = req.params;

    await prisma.leadershipes.delete({
      where: { id },
    });

    return res.status(200).json({
      success: true,
      message: "Leadership member removed successfully.",
    });
  } catch (error) {
    console.error("Delete Leadership Error:", error);
    return res.status(500).json({
      success: false,
      error: "Failed to delete leadership record.",
    });
  }
}
