const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const bcrypt = require('bcrypt');
const SALT_ROUNDS = 10;

class AuthController {
  async login(req, res, next) {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res.status(400).json({
          success: false,
          message: "تمامی فیلدها الزامی هستند",
        });
      }

      const user = await prisma.user.findUnique({
        where: { email },
      });

      if (!user) {
        return res.status(404).json({
          success: false,
          message: "هیچ کاربری یافت نشد",
        });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({
          success: false,
          message: "رمز عبور اشتباه است",
        });
      }

      return res.status(200).json({
        success: true,
        message: "با موفقیت وارد شدید",
        user: {
          id: user.id,
          fullName: `${user.firstName} ${user.lastName || ""}`.trim(),
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          role: user.role,
          gender: user.gender,
          phoneNumber: user.phoneNumber,
          birthDate: user.birthDate,
        },
      });
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .json({ success: false, message: "خطا در ورود لطفا مجددا تلاش نمایید" });
    }
  }

  async register(req, res, next) {
    try {
      const { firstName, lastName, birthDate, phoneNumber, email, password, role, gender } =
        req.body;

      if (!email || !firstName || !gender || !lastName || !birthDate || !phoneNumber || !password) {
        return res.status(400).json({
          success: false,
          message: "تمامی فیلدها الزامی هستند",
        });
      }

      const existingUser = await prisma.user.findUnique({
        where: { email },
      });

      if (existingUser) {
        return res.status(409).json({
          success: false,
          message: "این ایمیل قبلا ثبت شده است",
        });
      }

      const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

      const newUser = await prisma.user.create({
        data: {
          firstName,
          lastName,
          birthDate: new Date(birthDate),
          phoneNumber,
          email,
          password: hashedPassword,
          role: "CUSTOMER",
          gender: gender === "FEMALE" ? "FEMALE" : "MALE",
        },
      });

      return res.status(201).json({
        success: true,
        message: "ثبت نام با موفقیت انجام شد",
        user: {
          id: newUser.id,
          fullName: `${newUser.firstName} ${newUser.lastName || ""}`.trim(),
          firstName: newUser.firstName,
          lastName: newUser.lastName,
          birthDate: newUser.birthDate,
          phoneNumber: newUser.phoneNumber,
          email: newUser.email,
          role: newUser.role,
          gender: newUser.gender,
          createdAt: newUser.createdAt,
        },
      });
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .json({ success: false, message: "خطا در ثبت نام لطفا مجددا تلاش نمایید" });
    }
  }

  async getUserInfo(req, res, next) {
    try {
      const id = Number(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ success: false, message: "شناسه کاربر معتبر نیست" });
      }

      const user = await prisma.user.findUnique({
        where: { id },
      });

      if (!user) {
        return res.status(404).json({ success: false, message: "کاربری یافت نشد" });
      }

      return res.status(200).json({
        success: true,
        user: {
          id: user.id,
          fullName: `${user.firstName} ${user.lastName || ""}`.trim(),
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          role: user.role,
          gender: user.gender,
          phoneNumber: user.phoneNumber,
          birthDate: user.birthDate,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        },
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ success: false, message: "خطا در دریافت اطلاعات کاربر" });
    }
  }
}

module.exports = new AuthController();
