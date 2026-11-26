import { prisma } from "../db.js";
import { canAccessSection } from "../utils/dashboardAccess.js";

/**
 * @desc    Get all published videos (Public)
 * @route   GET /api/videos
 * @access  Public
 */
export async function getVideos(req, res) {
  try {
    const { category, department, search, all } = req.query;

    const where = {};

    if (all !== "true" || !canAccessSection(req.user, "videos")) {
      where.published = true;
    }

    if (category) {
      where.category = { contains: category };
    }

    if (department) {
      where.department = department.trim().toLowerCase();
    }

    if (search) {
      where.OR = [
        { title: { contains: search } },
        { doctor: { contains: search } },
        { department: { contains: search } },
        { description: { contains: search } },
      ];
    }

    const videos = await prisma.video.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });

    return res.status(200).json({
      success: true,
      count: videos.length,
      data: videos,
    });
  } catch (error) {
    console.error("Get Videos Error:", error);
    return res.status(500).json({
      success: false,
      error: "Khalad ayaa dhacay markii la keenayay muuqaalada (Server error)",
    });
  }
}

/**
 * @desc    Get single video by ID
 * @route   GET /api/videos/:id
 * @access  Public
 */
export async function getVideoById(req, res) {
  try {
    const { id } = req.params;

    const video = await prisma.video.findUnique({
      where: { id, published: true },
    });

    if (!video) {
      return res.status(404).json({
        success: false,
        error: "Muuqaalka lama helin (Video not found)",
      });
    }

    return res.status(200).json({
      success: true,
      data: video,
    });
  } catch (error) {
    console.error("Get Video By ID Error:", error);
    return res.status(500).json({
      success: false,
      error: "Khalad ayaa dhacay markii la keenayay muuqaalka (Server error)",
    });
  }
}

/**
 * @desc    Create new health video
 * @route   POST /api/videos
 * @access  Private (ADMIN ONLY)
 */
export async function createVideo(req, res) {
  try {
    const {
      title,
      doctor = "Al-Birri Medical Team",
      youtubeUrl,
      category = "Watch & Learn",
      department = "general",
      description,
      published = true,
    } = req.body;

    if (!title || !youtubeUrl) {
      return res.status(400).json({
        success: false,
        error: "Fadlan soo geli cinwaanka iyo YouTube Link-ga (Title and youtubeUrl are required)",
      });
    }

    const video = await prisma.video.create({
      data: {
        title: title.trim(),
        doctor: doctor.trim(),
        youtubeUrl: youtubeUrl.trim(),
        category: category.trim(),
        department: department.trim().toLowerCase(),
        description: description ? description.trim() : null,
        published: Boolean(published),
      },
    });

    return res.status(201).json({
      success: true,
      message: "Muuqaalka si guul leh ayaa loogu daray nidaamka",
      data: video,
    });
  } catch (error) {
    console.error("Create Video Error:", error);
    return res.status(500).json({
      success: false,
      error: "Khalad ayaa dhacay markii la abuurayay muuqaalka (Server error)",
    });
  }
}

/**
 * @desc    Update video details
 * @route   PATCH /api/videos/:id
 * @access  Private (ADMIN ONLY)
 */
export async function updateVideo(req, res) {
  try {
    const { id } = req.params;
    const updateData = { ...req.body };

    const existing = await prisma.video.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({
        success: false,
        error: "Muuqaalka lama helin (Video not found)",
      });
    }

    if (updateData.title) updateData.title = updateData.title.trim();
    if (updateData.doctor) updateData.doctor = updateData.doctor.trim();
    if (updateData.youtubeUrl) updateData.youtubeUrl = updateData.youtubeUrl.trim();
    if (updateData.category) updateData.category = updateData.category.trim();
    if (updateData.department) updateData.department = updateData.department.trim().toLowerCase();

    const updated = await prisma.video.update({
      where: { id },
      data: updateData,
    });

    return res.status(200).json({
      success: true,
      message: "Muuqaalka si guul leh ayaa loo cusboonaysiiyay",
      data: updated,
    });
  } catch (error) {
    console.error("Update Video Error:", error);
    return res.status(500).json({
      success: false,
      error: "Khalad ayaa dhacay markii la cusboonaysiinayay muuqaalka (Server error)",
    });
  }
}

/**
 * @desc    Delete video
 * @route   DELETE /api/videos/:id
 * @access  Private (ADMIN ONLY)
 */
export async function deleteVideo(req, res) {
  try {
    const { id } = req.params;

    const existing = await prisma.video.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({
        success: false,
        error: "Muuqaalka lama helin (Video not found)",
      });
    }

    await prisma.video.delete({ where: { id } });

    return res.status(200).json({
      success: true,
      message: "Muuqaalka si buuxda ayaa loo tirtiray",
    });
  } catch (error) {
    console.error("Delete Video Error:", error);
    return res.status(500).json({
      success: false,
      error: "Khalad ayaa dhacay markii la tirtirayay muuqaalka (Server error)",
    });
  }
}
