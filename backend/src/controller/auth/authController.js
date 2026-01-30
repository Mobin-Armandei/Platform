const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

class AuthController {
  async login(req, res, next) {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res.status(400).json({
          success: false,
          message: "تمامی فیلدها الزامی هستند"
        });
      }

      const user = await prisma.user.findUnique({
        where: { email },
      });

      if (!user) {
        return res.status(404).json({
          success: false,
          message: "هیچ کاربری یافت نشد"
        });
      }

      // بررسی پسورد (در حالت واقعی باید hash شود)
      if (user.password !== password) {
        return res.status(401).json({
          success: false,
          message: "رمز عبور اشتباه است"
        });
      }

      return res.status(200).json({
        success: true,
        message: "با موفقیت وارد شدید",
        user: {
          id: user.id,
          name: user.name,
          email: user.email
        }
      });
    } catch (error) {
      next(error);
      return res.status(500).json({ success: false, message: "خطا در ورود لطفا مجددا تلاش نمایید" });
    }
  }

  async register(req, res, next) {
    try {
      const { email, name, password } = req.body;
      if (!email || !name || !password) {
        return res.status(400).json({
          success: false,
          message: "تمامی فیلدها الزامی هستند"
        });
      }

      const existingUser = await prisma.user.findUnique({
        where: { email },
      });

      if (existingUser) {
        return res.status(409).json({
          success: false,
          message: "این ایمیل قبلا ثبت شده است"
        });
      }

      const newUser = await prisma.user.create({
        data: {
          name,
          email,
          password // در حالت واقعی باید hash شود
        }
      });

      return res.status(201).json({
        success: true,
        message: "ثبت نام با موفقیت انجام شد",
        user: {
          id: newUser.id,
          name: newUser.name,
          email: newUser.email,
          createdAt: newUser.createdAt
        }
      });
    } catch (error) {
      next(error);
      return res.status(500).json({ success: false, message: "خطا در ثبت نام لطفا مجددا تلاش نمایید" });
    }
  }

  async getUserInfo(req, res, next) {
    try {
      const id = Number(req.params.id);
      if (isNaN(id)) {
        return res.status(404).json({ success: false, message: "َشناسه کاربر معتبر نیست" });
      }
      const user = await prisma.user.findUnique({
        where: {
          id,
        }
      });
      if (!user) {
        return res.status(400).json({ success: false, message: "کاربری با این شناسه یافت نشد" });
      }
      return res.status(200).json({ success: true, user });
    } catch (error) {
      next(error);
      return res.status(500).json({ success: false, message: "خطا در دریافت کاربر" });
    }
  }
}

module.exports = new AuthController();