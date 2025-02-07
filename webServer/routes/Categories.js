const express = require('express');
var router = express.Router();
const categoryController = require('../controllers/Categories');
const { validate } = require('../middlewares/verifyJWT');
const { verifyRoles } = require('../middlewares/verifyRoles');
const ROLES_LIST = require('../config/roles_list.js');

router.route('/')
    .all(validate)
    .get(categoryController.getCategories)
    .post(verifyRoles(ROLES_LIST.admin), categoryController.createCategory);

router.route('/:id')
    .all(validate)
    .get(categoryController.getCategory)
    .patch(verifyRoles(ROLES_LIST.admin), categoryController.updateCategory)
    .delete(verifyRoles(ROLES_LIST.admin), categoryController.deleteCategory);

module.exports = router;
