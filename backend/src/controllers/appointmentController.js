import { prisma } from "../db.js";

const VALID_STATUSES = ["PENDING", "CONFIRMED", "COMPLETED", "CANCELLED"];

/**
 * @desc    Submit a new appointment booking request (Public)
 * @route   POST /api/appointments
 * @access  Public
 */
export async function createAppointment(req, res) {
  try {
    const { name, phone, email, department, date, time, message } = req.body;

    // Validation
    if (!name || !phone || !date || !time) {
      return res.status(400).json({
        success: false,
        error: "Fadlan buuxi magaca, taleefanka, taariikhda, iyo saacadda (Name, phone, date, and time are required)",
      });
    }

    if (phone.trim().length < 6) {
      return res.status(400).json({
        success: false,
        error: "Fadlan soo geli taleefan sax ah (Please provide a valid phone number)",
      });
    }

    const newAppointment = await prisma.appointment.create({
      data: {
        name: name.trim(),
        phone: phone.trim(),
        email: email ? email.trim().toLowerCase() : null,
        department: department ? department.trim().toLowerCase() : "general",
        date: date.trim(),
        time: time.trim(),
        message: message ? message.trim() : null,
        status: "PENDING",
      },
    });

    return res.status(201).json({
      success: true,
      message: "Codsiga balanta si guul leh ayaa loo diray (Appointment request submitted successfully)",
      data: newAppointment,
    });
  } catch (error) {
    console.error("Create Appointment Error:", error);
    return res.status(500).json({
      success: false,
      error: "Khalad ayaa dhacay markii la keydinayay balanta (Server error)",
    });
  }
}

/**
 * @desc    Get all appointments (Filterable by status, department, search, date)
 * @route   GET /api/appointments
 * @access  Private (ADMIN, RECEPTIONIST)
 */
export async function getAppointments(req, res) {
  try {
    const { status, department, search, date } = req.query;

    const where = {};

    if (status && VALID_STATUSES.includes(status.toUpperCase())) {
      where.status = status.toUpperCase();
    }

    if (department) {
      where.department = department.toLowerCase();
    }

    if (date) {
      where.date = date;
    }

    if (search) {
      where.OR = [
        { name: { contains: search } },
        { phone: { contains: search } },
        { email: { contains: search } },
      ];
    }

    const appointments = await prisma.appointment.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });

    return res.status(200).json({
      success: true,
      count: appointments.length,
      data: appointments,
    });
  } catch (error) {
    console.error("Get Appointments Error:", error);
    return res.status(500).json({
      success: false,
      error: "Khalad ayaa dhacay markii la soo saarayay balamaha (Server error)",
    });
  }
}

/**
 * @desc    Get single appointment by ID
 * @route   GET /api/appointments/:id
 * @access  Private (ADMIN, RECEPTIONIST)
 */
export async function getAppointmentById(req, res) {
  try {
    const { id } = req.params;

    const appointment = await prisma.appointment.findUnique({
      where: { id },
    });

    if (!appointment) {
      return res.status(404).json({
        success: false,
        error: "Balanta lama helin (Appointment not found)",
      });
    }

    return res.status(200).json({
      success: true,
      data: appointment,
    });
  } catch (error) {
    console.error("Get Appointment By ID Error:", error);
    return res.status(500).json({
      success: false,
      error: "Khalad ayaa dhacay markii la keenayay balanta (Server error)",
    });
  }
}

/**
 * @desc    Update appointment status (CONFIRMED, CANCELLED, COMPLETED)
 * @route   PATCH /api/appointments/:id/status
 * @access  Private (ADMIN, RECEPTIONIST)
 */
export async function updateAppointmentStatus(req, res) {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status || !VALID_STATUSES.includes(status.toUpperCase())) {
      return res.status(400).json({
        success: false,
        error: `Xaaladda balantu waa inay noqotaa: ${VALID_STATUSES.join(", ")}`,
      });
    }

    const existing = await prisma.appointment.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({
        success: false,
        error: "Balanta lama helin (Appointment not found)",
      });
    }

    const updated = await prisma.appointment.update({
      where: { id },
      data: { status: status.toUpperCase() },
    });

    return res.status(200).json({
      success: true,
      message: "Xaaladda balanta si guul leh ayaa loo cusboonaysiiyay",
      data: updated,
    });
  } catch (error) {
    console.error("Update Appointment Status Error:", error);
    return res.status(500).json({
      success: false,
      error: "Khalad ayaa dhacay markii la cusboonaysiinayay balanta (Server error)",
    });
  }
}

/**
 * @desc    Delete appointment
 * @route   DELETE /api/appointments/:id
 * @access  Private (ADMIN ONLY)
 */
export async function deleteAppointment(req, res) {
  try {
    const { id } = req.params;

    const existing = await prisma.appointment.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({
        success: false,
        error: "Balanta lama helin (Appointment not found)",
      });
    }

    await prisma.appointment.delete({ where: { id } });

    return res.status(200).json({
      success: true,
      message: "Balanta si buuxda ayaa loo tirtiray (Appointment deleted successfully)",
    });
  } catch (error) {
    console.error("Delete Appointment Error:", error);
    return res.status(500).json({
      success: false,
      error: "Khalad ayaa dhacay markii la tirtirayay balanta (Server error)",
    });
  }
}
