const { Router } = require("express");
const { check } = require("express-validator");

const {
  fieldValidator,
  jwtValidate,
  adminRoleValidator,
  hasRole,
} = require("../middlewares");
const {
  createCategory,
  getAllCategories,
  getCategoriesById,
  editCategory,
  deleteCategory,
} = require("../controllers/categories");
const { categoryExists } = require("../helpers/dbValidators");

const router = Router();

//Obtener todas las categorias - Publico
router.get(
  "/",
  [
    check("limit", "The limit has to be a number").optional().isNumeric(),
    check("from", "Init value has to be a number").optional().isNumeric(),
    fieldValidator,
  ],
  getAllCategories
);

//Obtener una categoria por Id - Publico
router.get(
  "/:id",

  [
    check('id').custom(categoryExists),
    check("id", "It is not a MongoID").isMongoId(),
    fieldValidator],

  getCategoriesById
);

//Crear una nueva categoría - Privado con cualquier role
router.post(
  "/",
  [
    jwtValidate,
    check("name", "Name is required").not().isEmpty(),
    fieldValidator,
  ],
  createCategory
);

//Actualizar un registro - Privado con cualquier role
router.put(
  "/:id",
  [
    jwtValidate,
    hasRole('ADMIN_ROLE'),
    check("id").trim().custom(categoryExists),
    check("id", "Is not a valid ID").trim().isMongoId(),
    fieldValidator,
  ],

  editCategory
);

//Eliminar un registro - Privado con ADMIN_ROLE
router.delete(
  "/:id",
  [
    jwtValidate,
    hasRole('ADMIN_ROLE'),
    check("id").trim().custom(categoryExists),
    check("id", "Is not a valid ID").trim().isMongoId(),
    fieldValidator,
  ],
  deleteCategory
);

module.exports = router;
