const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const slugify = require("slugify");

class CategoryController {
  async create(req, res, next) {
    try {
      const { title, description, parent } = req.body;
      if (!title || !description) {
        return res.status(400).json({
          success: false,
          message: "عنوان و توضیح الزامی هستند",
        });
      }
      const slug = slugify(title, { lower: true, strict: true });
      const exists = await prisma.category.findFirst({
        where: {
          OR: [{ title }, { slug }],
        },
      });
      if (exists) {
        return res.status(409).json({
          success: false,
          message: "گروه مطلب تکراری است",
        });
      }
      const category = await prisma.category.create({
        data: {
          title,
          description,
          slug,
          parentId: parent ? Number(parent) : null,
        },
      });
      return res.status(200).json({
        success: true,
        message: "گروه مطلب با موفقیت ایجاد شد",
        category,
      });
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .json({ succes: false, message: "خطا در ایجاد گروه مطالب" });
    }
  }
  async list(req, res) {
    try {
      const categories = await prisma.category.findMany({
        orderBy: { id: "desc" },
      });
      return res.json({ success: true, categories });
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .json({ success: false, message: "خطا در دریافت لیست گروه مطالب" });
    }
  }
  async tree(req, res) {
    const categories = await prisma.category.findMany({
      where: { parentId: null },
      include: {
        children: {
          include: {
            children: true,
          },
        },
      },
    });
    if (categories.length === 0) {
      return res.status(201).json({ success: true, data: 0 });
    }
    return res.json({
      success: true,
      categories,
    });
  }
  async delete(req, res) {
    try {
      const { id } = req.params;

      await prisma.category.delete({
        where: { id: Number(id) },
      });
      return res.json({
        success: true,
        message: "گروه مطلب حذف شد",
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: "ابتدا زیرگروه‌ها را حذف کنید",
      });
    }
  }
}

module.exports = new CategoryController();
