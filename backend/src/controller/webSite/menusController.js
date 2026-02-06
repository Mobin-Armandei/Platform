const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

module.exports = {
    async getAllMenus(req, res) {
        try {
            const menus = await prisma.menu.findMany({
                where: { parentId: null },
                orderBy: { order: "asc" },
                include: {
                    subMenus: {
                        orderBy: { order: "asc" },
                        include: {
                            subMenus: true,
                        },
                    },
                },
            });

            res.json({ success: true, menus });
        } catch (err) {
            console.log(err);
            return res.status(500).json({ success: false, message: "خطا در دریافت منوها" });
        }
    },

    async getMenuById(req, res) {
        const id = Number(req.params.id);
        if (isNaN(id)) {
            return res.status(400).json({ message: "شناسه نامعتبر است" });
        }

        const menu = await prisma.menu.findUnique({
            where: { id },
            include: {
                parent: true,
                subMenus: true,
            },
        });

        if (!menu) {
            return res.status(404).json({ message: "منو یافت نشد" });
        }

        res.json({ success: true, menu });
    },

    async createMenu(req, res) {
        const { title, url, parentId, order } = req.body;

        const menu = await prisma.menu.create({
            data: {
                title,
                url,
                order: order ?? 0,
                parentId: parentId ?? null,
            },
        });

        res.status(201).json({ success: true, menu });
    },

    async updateMenu(req, res) {
        const id = Number(req.params.id);
        const { title, url, parentId, order } = req.body;

        const menu = await prisma.menu.update({
            where: { id },
            data: {
                title,
                url,
                order,
                parentId,
            },
        });

        res.json({ success: true, menu });
    },

    async deleteMenu(req, res) {
        const id = Number(req.params.id);

        await prisma.menu.delete({ where: { id } });

        res.json({ success: true, message: "منو حذف شد" });
    },
};
