const router = require("express").Router();
const postController = require("../controller/content/postController");
const auth = require("../middleware/auth");

router.post("/create", auth, postController.create);
router.get("/list", auth, postController.list);
router.delete("/delete/:id", auth, postController.delete);

module.exports = router;
