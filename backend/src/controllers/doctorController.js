import { prisma } from "../db.js";

const EMPLOYMENT_STATUSES = ["CURRENT", "FORMER"];

/**
 * @desc    Get all doctors (Public)
 * @route   GET /api/doctors
 * @access  Public
 */
export async function getDoctors(req, res) {
  try {
    const { search, department, specialty, employmentStatus, available, featured, limit } = req.query;

    const where = {};

    if (employmentStatus !== undefined) {
      if (!EMPLOYMENT_STATUSES.includes(employmentStatus)) {
        return res.status(400).json({ success: false, error: "Choose a current or former doctor status." });
      }
      where.employmentStatus = employmentStatus;
    }

    if (available !== undefined) {
      where.available = available === "true";
    }

    if (featured !== undefined) {
      where.featured = featured === "true";
    }

    if (department) {
      where.department = department.toLowerCase();
    }

    if (specialty) {
      where.specialty = { contains: specialty };
    }

    if (search) {
      where.OR = [
        { name: { contains: search } },
        { title: { contains: search } },
        { specialty: { contains: search } },
      ];
    }

    const doctors = await prisma.doctor.findMany({
      where,
      take: limit ? Math.max(1, Math.min(Number(limit) || 3, 50)) : undefined,
      orderBy: { createdAt: "asc" },
    });

    return res.status(200).json({
      success: true,
      count: doctors.length,
      data: doctors,
    });
  } catch (error) {
    console.error("Get Doctors Error:", error);
    return res.status(500).json({
      success: false,
      error: "Khalad ayaa dhacay markii la keenayay dhakhaatiirta (Server error)",
    });
  }
}

/**
 * @desc    Get single doctor by ID
 * @route   GET /api/doctors/:id
 * @access  Public
 */
export async function getDoctorById(req, res) {
  try {
    const { id } = req.params;

    const doctor = await prisma.doctor.findUnique({
      where: { id },
    });

    if (!doctor) {
      return res.status(404).json({
        success: false,
        error: "Dhaqtarka lama helin (Doctor not found)",
      });
    }

    return res.status(200).json({
      success: true,
      data: doctor,
    });
  } catch (error) {
    console.error("Get Doctor By ID Error:", error);
    return res.status(500).json({
      success: false,
      error: "Khalad ayaa dhacay markii la keenayay dhaqtarka (Server error)",
    });
  }
}

/**
 * @desc    Create new doctor
 * @route   POST /api/doctors
 * @access  Private (ADMIN ONLY)
 */
export async function createDoctor(req, res) {
  try {
    const {
      name,
      title,
      specialty,
      badge = "Specialist",
      image,
      details,
      department,
      experience,
      employmentStatus = "CURRENT",
      available = true,
      featured = false,
    } = req.body;

    if (!name || !title || !specialty || !image) {
      return res.status(400).json({
        success: false,
        error: "Fadlan buuxi magaca, title-ka, takhasuska, iyo sawirka (Name, title, specialty, and image are required)",
      });
    }

    if (!EMPLOYMENT_STATUSES.includes(employmentStatus)) {
      return res.status(400).json({ success: false, error: "Choose a current or former doctor status." });
    }

    const canFeature = employmentStatus === "CURRENT" && Boolean(featured);

    if (canFeature) {
      const featuredCount = await prisma.doctor.count({ where: { featured: true } });
      if (featuredCount >= 3) {
        return res.status(409).json({
          success: false,
          error: "Homepage-ka waxaa lagu soo bandhigi karaa ugu badnaan 3 dhakhtar.",
        });
      }
    }

    const doctor = await prisma.doctor.create({
      data: {
        name: name.trim(),
        title: title.trim(),
        specialty: specialty.trim(),
        badge: badge.trim(),
        image: image.trim(),
        details: details ? details.trim() : null,
        department: department ? department.trim().toLowerCase() : null,
        experience: experience ? experience.trim() : null,
        ...(employmentStatus === "FORMER" ? { employmentStatus } : {}),
        available: employmentStatus === "CURRENT" && Boolean(available),
        featured: canFeature,
      },
    });

    return res.status(201).json({
      success: true,
      message: "Dhaqtarka si guul leh ayaa loogu daray nidaamka",
      data: doctor,
    });
  } catch (error) {
    console.error("Create Doctor Error:", error);
    return res.status(500).json({
      success: false,
      error: "Khalad ayaa dhacay markii la abuurayay dhaqtarka (Server error)",
    });
  }
}

/**
 * @desc    Update doctor details
 * @route   PATCH /api/doctors/:id
 * @access  Private (ADMIN ONLY)
 */
export async function updateDoctor(req, res) {
  try {
    const { id } = req.params;
    const updateData = { ...req.body };

    if (updateData.employmentStatus !== undefined && !EMPLOYMENT_STATUSES.includes(updateData.employmentStatus)) {
      return res.status(400).json({ success: false, error: "Choose a current or former doctor status." });
    }

    const existing = await prisma.doctor.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({
        success: false,
        error: "Dhaqtarka lama helin (Doctor not found)",
      });
    }

    const currentStatus = existing.employmentStatus ?? "CURRENT";
    const employmentStatus = updateData.employmentStatus ?? currentStatus;
    if (employmentStatus === currentStatus) delete updateData.employmentStatus;
    if (employmentStatus === "FORMER") {
      updateData.available = false;
      updateData.featured = false;
    }

    if (updateData.featured === true && !existing.featured) {
      const featuredCount = await prisma.doctor.count({ where: { featured: true } });
      if (featuredCount >= 3) {
        return res.status(409).json({
          success: false,
          error: "Homepage-ka waxaa lagu soo bandhigi karaa ugu badnaan 3 dhakhtar.",
        });
      }
    }

    // Clean data
    if (updateData.name) updateData.name = updateData.name.trim();
    if (updateData.title) updateData.title = updateData.title.trim();
    if (updateData.specialty) updateData.specialty = updateData.specialty.trim();
    if (updateData.badge) updateData.badge = updateData.badge.trim();
    if (updateData.image) updateData.image = updateData.image.trim();
    if (updateData.department) updateData.department = updateData.department.trim().toLowerCase();
    if (updateData.details === "") updateData.details = null;
    if (updateData.experience === "") updateData.experience = null;

    const updated = await prisma.doctor.update({
      where: {
        id,
        ...(existing.employmentStatus ? { employmentStatus: existing.employmentStatus } : {}),
      },
      data: updateData,
    });

    return res.status(200).json({
      success: true,
      message: "Xogta dhaqtarka si guul leh ayaa loo cusboonaysiiyay",
      data: updated,
    });
  } catch (error) {
    if (error.code === "P2025") {
      return res.status(409).json({ success: false, error: "This doctor changed while you were editing. Refresh and try again." });
    }
    console.error("Update Doctor Error:", error);
    return res.status(500).json({
      success: false,
      error: "Khalad ayaa dhacay markii la cusboonaysiinayay dhaqtarka (Server error)",
    });
  }
}

/**
 * @desc    Delete doctor
 * @route   DELETE /api/doctors/:id
 * @access  Private (ADMIN ONLY)
 */
export async function deleteDoctor(req, res) {
  try {
    const { id } = req.params;

    const existing = await prisma.doctor.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({
        success: false,
        error: "Dhaqtarka lama helin (Doctor not found)",
      });
    }

    await prisma.doctor.delete({ where: { id } });

    return res.status(200).json({
      success: true,
      message: "Dhaqtarka si buuxda ayaa loo tirtiray",
    });
  } catch (error) {
    console.error("Delete Doctor Error:", error);
    return res.status(500).json({
      success: false,
      error: "Khalad ayaa dhacay markii la tirtirayay dhaqtarka (Server error)",
    });
  }
}
