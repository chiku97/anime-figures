import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const saveContactRequest = async (req, res) => {
  try {
    const { carId, name, email, phone, message } = req.body;

    // Validate required fields
    if (!carId || !name || !email || !phone) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields: carId, name, email, phone",
      });
    }

    // Check if car exists
    const car = await prisma.car.findUnique({
      where: { id: carId },
    });

    if (!car) {
      return res.status(404).json({
        success: false,
        message: "Car not found",
      });
    }

    // Save contact request
    const contactRequest = await prisma.contactRequest.create({
      data: {
        carId,
        name,
        email,
        phone,
        message: message || null,
      },
      include: {
        car: true,
      },
    });

    return res.status(201).json({
      success: true,
      message: "Our executive will contact you soon.",
      data: contactRequest,
    });
  } catch (error) {
    console.error("Error saving contact request:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to save contact request, please try again later.",
      error: error.message,
    });
  }
};

export const getContactRequests = async (req, res) => {
  try {
    const { carId, email } = req.query;

    let where = {};
    if (carId) where.carId = carId;
    if (email) where.email = email;

    const contactRequests = await prisma.contactRequest.findMany({
      where,
      include: {
        car: true,
      },
      orderBy: {
        created_at: "desc",
      },
    });

    return res.status(200).json({
      success: true,
      data: contactRequests,
    });
  } catch (error) {
    console.error("Error fetching contact requests:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch contact requests",
      error: error.message,
    });
  }
};

export const deleteContactRequest = async (req, res) => {
  try {
    const { id } = req.params;

    const contactRequest = await prisma.contactRequest.delete({
      where: { id },
    });

    return res.status(200).json({
      success: true,
      message: "Contact request deleted successfully",
      data: contactRequest,
    });
  } catch (error) {
    console.error("Error deleting contact request:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to delete contact request",
      error: error.message,
    });
  }
};
