import { prisma } from "../db.js";

/**
 * Generate URL-friendly slug from title
 * @param {string} text
 * @returns {string}
 */
function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "") // Remove non-word characters
    .replace(/[\s_-]+/g, "-")  // Replace spaces and underscores with single hyphen
    .replace(/^-+|-+$/g, "");  // Trim hyphens from ends
}

/**
 * @desc    Get all published blogs/articles (Public)
 * @route   GET /api/blogs
 * @access  Public
 */
export async function getBlogs(req, res) {
  try {
    const { category, search, all, limit } = req.query;

    const where = {};

    // Only show published articles unless explicitly requested by admin
    if (all !== "true") {
      where.published = true;
    }

    if (category) {
      where.category = { contains: category };
    }

    if (search) {
      where.OR = [
        { title: { contains: search } },
        { excerpt: { contains: search } },
        { content: { contains: search } },
        { author: { contains: search } },
      ];
    }

    const take = limit ? Number(limit) : undefined;

    const blogs = await prisma.blog.findMany({
      where,
      take,
      orderBy: { createdAt: "desc" },
    });

    return res.status(200).json({
      success: true,
      count: blogs.length,
      data: blogs,
    });
  } catch (error) {
    console.error("Get Blogs Error:", error);
    return res.status(500).json({
      success: false,
      error: "Khalad ayaa dhacay markii la soo saarayay maqaalada (Server error)",
    });
  }
}

/**
 * @desc    Get single blog by ID or Slug
 * @route   GET /api/blogs/:idOrSlug
 * @access  Public
 */
export async function getBlogByIdOrSlug(req, res) {
  try {
    const { idOrSlug } = req.params;

    // Search by either ID or unique Slug
    let blog = await prisma.blog.findFirst({
      where: {
        OR: [{ id: idOrSlug }, { slug: idOrSlug }],
      },
    });

    if (!blog) {
      return res.status(404).json({
        success: false,
        error: "Maqaalka lama helin (Blog article not found)",
      });
    }

    // Automatically increment view count
    blog = await prisma.blog.update({
      where: { id: blog.id },
      data: { views: { increment: 1 } },
    });

    return res.status(200).json({
      success: true,
      data: blog,
    });
  } catch (error) {
    console.error("Get Blog By ID/Slug Error:", error);
    return res.status(500).json({
      success: false,
      error: "Khalad ayaa dhacay markii la keenayay maqaalka (Server error)",
    });
  }
}

/**
 * @desc    Create a new blog article
 * @route   POST /api/blogs
 * @access  Private (ADMIN ONLY)
 */
export async function createBlog(req, res) {
  try {
    const {
      title,
      slug,
      excerpt,
      content,
      image,
      category,
      author = "Al-Birri Medical Team",
      published = true,
    } = req.body;

    if (!title || !excerpt || !image || !category) {
      return res.status(400).json({
        success: false,
        error: "Fadlan buuxi cinwaanka, qoraalka kooban, sawirka, iyo qaybta (Title, excerpt, image, and category are required)",
      });
    }

    // Auto-generate slug if not provided
    let finalSlug = slug ? slugify(slug) : slugify(title);

    // Ensure slug is unique
    const existingSlug = await prisma.blog.findUnique({
      where: { slug: finalSlug },
    });

    if (existingSlug) {
      finalSlug = `${finalSlug}-${Date.now().toString().slice(-4)}`;
    }

    const blog = await prisma.blog.create({
      data: {
        title: title.trim(),
        slug: finalSlug,
        excerpt: excerpt.trim(),
        content: content ? content.trim() : excerpt.trim(),
        image: image.trim(),
        category: category.trim(),
        author: author.trim(),
        published: Boolean(published),
      },
    });

    return res.status(201).json({
      success: true,
      message: "Maqaalka si guul leh ayaa loo daabacay",
      data: blog,
    });
  } catch (error) {
    console.error("Create Blog Error:", error);
    return res.status(500).json({
      success: false,
      error: "Khalad ayaa dhacay markii la abuurayay maqaalka (Server error)",
    });
  }
}

/**
 * @desc    Update a blog article
 * @route   PATCH /api/blogs/:id
 * @access  Private (ADMIN ONLY)
 */
export async function updateBlog(req, res) {
  try {
    const { id } = req.params;
    const updateData = { ...req.body };

    const existing = await prisma.blog.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({
        success: false,
        error: "Maqaalka lama helin (Blog article not found)",
      });
    }

    if (updateData.title) updateData.title = updateData.title.trim();
    if (updateData.excerpt) updateData.excerpt = updateData.excerpt.trim();
    if (updateData.category) updateData.category = updateData.category.trim();
    if (updateData.image) updateData.image = updateData.image.trim();
    if (updateData.slug) updateData.slug = slugify(updateData.slug);

    const updated = await prisma.blog.update({
      where: { id },
      data: updateData,
    });

    return res.status(200).json({
      success: true,
      message: "Maqaalka si guul leh ayaa loo cusboonaysiiyay",
      data: updated,
    });
  } catch (error) {
    console.error("Update Blog Error:", error);
    return res.status(500).json({
      success: false,
      error: "Khalad ayaa dhacay markii la cusboonaysiinayay maqaalka (Server error)",
    });
  }
}

/**
 * @desc    Delete a blog article
 * @route   DELETE /api/blogs/:id
 * @access  Private (ADMIN ONLY)
 */
export async function deleteBlog(req, res) {
  try {
    const { id } = req.params;

    const existing = await prisma.blog.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({
        success: false,
        error: "Maqaalka lama helin (Blog article not found)",
      });
    }

    await prisma.blog.delete({ where: { id } });

    return res.status(200).json({
      success: true,
      message: "Maqaalka si buuxda ayaa loo tirtiray",
    });
  } catch (error) {
    console.error("Delete Blog Error:", error);
    return res.status(500).json({
      success: false,
      error: "Khalad ayaa dhacay markii la tirtirayay maqaalka (Server error)",
    });
  }
}
