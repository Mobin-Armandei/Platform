const { Router } = require('express');
const menuController = require('../controller/webSite/menusController');
const router = Router();

router.get("/", menuController.getAllMenus);
router.get("/:id", menuController.getMenuById);
router.post("/", menuController.createMenu);
router.put("/:id", menuController.updateMenu);
router.delete("/:id", menuController.deleteMenu);


module.exports = router;