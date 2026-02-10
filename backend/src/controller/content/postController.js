const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

class PostController {
  async create(req, res, next) {
    try {
      const { title, content, foreword, tags, categoryId, published } =
        req.body;
      if (!title || !categoryId || !foreword) {
        return res.status(400).json({
          success: false,
          message: "فیلدهای الزامی تکمیل نشده‌اند",
        });
      }
      const post = await prisma.post.create({
        data: {
          title,
          content,
          foreword,
          tags,
          categoryId: Number(categoryId),
          authorId: req.user.id,
          published: Boolean(published),
          publishedAt: published ? new Date() : null,
        },
      });
      return res.status(201).json({
        success: true,
        message: "پست با موفقیت ایجاد شد",
        post,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        success: false,
        message: "خطا در ایجاد مطلب لطفا مجدد تلاش نمایید",
      });
    }
  }
  async list(req, res) {
    try {
      const posts = await prisma.post.findMany({
        include: {
          category: { select: { title: true } },
          author: { select: { firstName: true, lastName: true, email: true } },
        },
        orderBy: { id: "desc" },
      });
      return res.status(200).json({ success: true, data: posts });
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .json({ success: false, message: "خطا در دریافت پست‌ها" });
    }
  }

  async delete(req, res) {
    try {
      const id = Number(req.params.id);
      if (isNaN(id)) {
        return res
          .status(400)
          .json({ success: false, message: "شناسه معتبر نیست" });
      }
      const post = await prisma.post.findUnique({
        where: { id },
      });
      if (!post) {
        return res
          .status(404)
          .json({ success: false, message: "پست یافت نشد" });
      }
      await prisma.post.delete({
        where: { id },
      });
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .json({ success: false, message: "خطا در حذف پست" });
    }
  }
}

module.exports = new PostController();
