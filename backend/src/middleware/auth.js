const jwt = require("jsonwebtoken");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

module.exports = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "توکن ارسال نشده",
      });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // ✅ درست
    const userId = decoded.id;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        role: true,
        roleRel: {
          select: {
            name: true,
          },
        },
      },
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "کاربر یافت نشد",
      });
    }

    // اطلاعات کاربر در req
    req.user = {
      id: user.id,
      fullName: `${user.firstName} ${user.lastName ?? ""}`.trim(),
      role: user.role,
      roleName: user.roleRel.name,
    };

    next();
  } catch (error) {
    console.error("❌ Auth error:", error);

    return res.status(401).json({
      success: false,
      message: "توکن نامعتبر است",
    });
  }
};
