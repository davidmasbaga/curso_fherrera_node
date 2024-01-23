const { Router } = require("express");
const { check } = require("express-validator");

const {
  fieldValidator,
  jwtValidate,
  adminRoleValidator,
  hasRole,
} = require("../middlewares");
const { createProduct, getAllProducts, getProductsById, editProduct, deleteProduct } = require("../controllers/products");
const { categoryExists, productExists } = require("../helpers/dbValidators");
const { deleteCategory } = require("../controllers/categories");

const router = Router();

//Obtener todas las categorias - Publico
router.get(
  "/",[
    check("limit", "The limit has to be a number").optional().isNumeric(),
    check("from", "Init value has to be a number").optional().isNumeric(),
    fieldValidator,
  ],getAllProducts
);

//Obtener una categoria por Id - Publico
router.get(
  "/:id",[
    check('id').custom(productExists),
    check("id", "It is not a MongoID").isMongoId(),
    fieldValidator],

  getProductsById
  
);

//Crear una nueva categoría - Privado con cualquier role
router.post(
  "/",[
    jwtValidate,
    check("name", "Name is required").not().isEmpty(),
    fieldValidator,
  ],createProduct
);

//Actualizar un registro - Privado con cualquier role
router.put(
  "/:id", [
    jwtValidate,
    hasRole('ADMIN_ROLE'),
    check("id").trim().custom(productExists),
    check("id", "Is not a valid ID").trim().isMongoId(),
    fieldValidator,
  ], editProduct
);

//Eliminar un registro - Privado con ADMIN_ROLE
router.delete(
  "/:id", [
    jwtValidate,
    hasRole('ADMIN_ROLE'),
    check("id").trim().custom(productExists),
    check("id", "Is not a valid ID").trim().isMongoId(),
    fieldValidator,
  ], deleteProduct
  
);

module.exports = router;
