const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
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

      const token = jwt.sign(
        {
          id: user.id,
          role: user.roleRel.name,
          email: user.email,
        },
        process.env.JWT_SECRET,
        {
          expiresIn: "7d",
        }
      );

      return res.status(200).json({
        success: true,
        message: "با موفقیت وارد شدید",
        token,
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
      return res.status(500).json({
        success: false,
        message: "خطا در ورود لطفا مجددا تلاش نمایید",
      });
    }
  }

  async register(req, res) {
    try {
      const {
        firstName,
        lastName,
        birthDate,
        phoneNumber,
        email,
        password,
        gender,
      } = req.body;

      if (
        !email ||
        !firstName ||
        !lastName ||
        !birthDate ||
        !phoneNumber ||
        !password ||
        !gender
      ) {
        return res
          .status(400)
          .json({ success: false, message: "تمامی فیلدها الزامی هستند" });
      }

      const existingEmail = await prisma.user.findUnique({ where: { email } });
      if (existingEmail) {
        return res
          .status(409)
          .json({ success: false, message: "این ایمیل قبلا ثبت شده است" });
      }

      const existingPhoneNumber = await prisma.user.findUnique({
        where: { phoneNumber },
      });
      if (existingPhoneNumber) {
        return res
          .status(409)
          .json({
            success: false,
            message: "این شماره‌همراه قبلا ثبت شده است",
          });
      }

      const existingRole = await prisma.role.findUnique({
        where: { name: "CUSTOMER" },
      });
      if (!existingRole) {
        return res
          .status(500)
          .json({ success: false, message: "نقش مشتری در سیستم ثبت نشده است" });
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
          gender: gender === "FEMALE" ? "FEMALE" : "MALE",
          roleRel: { connect: { id: existingRole.id } },
          role: existingRole.name,
        },
      });

      return res.status(201).json({
        success: true,
        message: "ثبت نام با موفقیت انجام شد",
        user: {
          id: newUser.id,
          fullName: `${newUser.firstName} ${newUser.lastName}`.trim(),
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
      return res.status(500).json({
        success: false,
        message: "خطا در ثبت نام لطفا مجددا تلاش نمایید",
      });
    }
  }

  async getUserInfo(req, res, next) {
    try {
      const id = Number(req.params.id);
      if (isNaN(id)) {
        return res
          .status(400)
          .json({ success: false, message: "شناسه کاربر معتبر نیست" });
      }

      const user = await prisma.user.findUnique({
        where: { id },
      });

      if (!user) {
        return res
          .status(404)
          .json({ success: false, message: "کاربری یافت نشد" });
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
      return res
        .status(500)
        .json({ success: false, message: "خطا در دریافت اطلاعات کاربر" });
    }
  }
}

module.exports = new AuthController();
