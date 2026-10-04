import { prisma } from "../db.js";

/**
 * @desc    Submit a contact message / patient inquiry
 * @route   POST /api/contact
 * @access  Public
 */
export async function createContactMessage(req, res) {
  try {
    const { name, email, phone, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
      return res.status(400).json({
        success: false,
        error: "Name, email, subject, and message are required fields.",
      });
    }

    const created = await prisma.contactMessage.create({
      data: {
        name: name.trim(),
        email: email.toLowerCase().trim(),
        phone: phone ? phone.trim() : null,
        subject: subject.trim(),
        message: message.trim(),
        status: "UNREAD",
      },
    });

    return res.status(201).json({
      success: true,
      message: "Your message has been sent successfully. We will get back to you shortly.",
      data: created,
    });
  } catch (error) {
    console.error("Create Contact Message Error:", error);
    return res.status(500).json({
      success: false,
      error: "Failed to send your message. Please try again or call our hotline 4446.",
    });
  }
}

/**
 * @desc    Get all contact inquiries
 * @route   GET /api/contact
 * @access  Private (ADMIN, RECEPTIONIST)
 */
export async function getContactMessages(req, res) {
  try {
    const { status, search } = req.query;

    const where = {};

    if (status && status !== "ALL") {
      where.status = status;
    }

    if (search) {
      where.OR = [
        { name: { contains: search } },
        { email: { contains: search } },
        { subject: { contains: search } },
        { message: { contains: search } },
      ];
    }

    const messages = await prisma.contactMessage.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });

    return res.status(200).json({
      success: true,
      count: messages.length,
      data: messages,
    });
  } catch (error) {
    console.error("Get Contact Messages Error:", error);
    return res.status(500).json({
      success: false,
      error: "Failed to retrieve messages.",
    });
  }
}

/**
 * @desc    Get single contact message by ID
 * @route   GET /api/contact/:id
 * @access  Private (ADMIN, RECEPTIONIST)
 */
export async function getContactMessageById(req, res) {
  try {
    const { id } = req.params;

    const message = await prisma.contactMessage.findUnique({
      where: { id },
    });

    if (!message) {
      return res.status(404).json({
        success: false,
        error: "Message not found.",
      });
    }

    // Auto mark as READ when opened if UNREAD
    if (message.status === "UNREAD") {
      await prisma.contactMessage.update({
        where: { id },
        data: { status: "READ" },
      });
      message.status = "READ";
    }

    return res.status(200).json({
      success: true,
      data: message,
    });
  } catch (error) {
    console.error("Get Message Detail Error:", error);
    return res.status(500).json({
      success: false,
      error: "Failed to retrieve message details.",
    });
  }
}

/**
 * @desc    Update contact message status (UNREAD, READ, ARCHIVED)
 * @route   PATCH /api/contact/:id/status
 * @access  Private (ADMIN, RECEPTIONIST)
 */
export async function updateContactMessageStatus(req, res) {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ["UNREAD", "READ", "ARCHIVED"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        error: `Status must be one of: ${validStatuses.join(", ")}`,
      });
    }

    const updated = await prisma.contactMessage.update({
      where: { id },
      data: { status },
    });

    return res.status(200).json({
      success: true,
      message: `Message status updated to ${status}`,
      data: updated,
    });
  } catch (error) {
    console.error("Update Message Status Error:", error);
    return res.status(500).json({
      success: false,
      error: "Failed to update message status.",
    });
  }
}

/**
 * @desc    Delete contact message
 * @route   DELETE /api/contact/:id
 * @access  Private (ADMIN only)
 */
export async function deleteContactMessage(req, res) {
  try {
    const { id } = req.params;

    await prisma.contactMessage.delete({
      where: { id },
    });

    return res.status(200).json({
      success: true,
      message: "Message deleted successfully.",
    });
  } catch (error) {
    console.error("Delete Message Error:", error);
    return res.status(500).json({
      success: false,
      error: "Failed to delete message.",
    });
  }
}
