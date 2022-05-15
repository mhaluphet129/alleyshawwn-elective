let router = require("express").Router();

var nameController = require("./controller/nameController");

router.get("/", nameController.redirect);
router.get("/login", nameController.get_login);
router.post("/login", nameController.post_login);
router.get("/register", nameController.get_register);
router.post("/register", nameController.post_register);
router.get("/logout", nameController.logout);
router.get("/home", nameController.home);
router.post("/update-info", nameController.updateInfo);
router.post("/update-password", nameController.updatePass);
router.get("/delete", nameController.delete);

router.get("/view/:name_id", nameController.view_data);
router.get("/delete/:name_id", nameController.delete_name);
router.put("/update/:name_id", nameController.update_name);

module.exports = router;
