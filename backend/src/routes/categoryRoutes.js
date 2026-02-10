const { Router } = require('express');
const categoryController = require('../controller/content/categoryController');
const isAuthenticated = require("../middleware/auth");
const checkRole = require("../middleware/role");
const router = Router();

router.post("/create", isAuthenticated, checkRole("CUSTOMER", "SITE_MANAGER"), categoryController.create);
router.get("/list", isAuthenticated, categoryController.list);
router.get("/tree", isAuthenticated, categoryController.tree);
router.delete("/:id", isAuthenticated, checkRole(["ADMIN", "SITE_MANAGER"]), categoryController.delete);

module.exports = router;