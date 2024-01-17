const { response } = require("express");
const { Category, User } = require("../models");
const colors = require("colors");
const { localHour } = require("../helpers/utils");

const createCategory = async (req, res = response) => {
  const name = req.body.name.toUpperCase();
  const user = req.user;

  const categoryDB = await Category.findOne({ name });

  if (categoryDB) {
    return res.status(400).json({ msg: `${categoryDB.name} already exist` });
  }

  if (user.role !== "ADMIN_ROLE") {
    return res
      .status(500)
      .json({ msg: "Unauthorized role to create a new Product" });
  }

  const data = {
    name,
    user: req.user._id,
  };

  const category = await new Category(data);

  // Guardar DB

  await category.save();
  res.status(200).json(category);
};

const getAllCategories = async (req, res = response) => {
  const { limit = "", from = 0 } = req.query;
  const queryStatus = { status: true };

  try {
    const [total, categories] = await Promise.all([
      Category.countDocuments(queryStatus),
      Category.find(queryStatus)
        .populate({
          path: "user",
          select: "email role",
        })
        .skip(Number(from))
        .limit(Number(limit)),
    ]);
    res.status(200).json({ total, categories });
  } catch (error) {
    console.log(
      colors.red("[Category Error]") +
        " no se ha podido mostrar la lista de categorías: " +
        error
    );
    res.status(400).json(error);
  }
};

const getCategoriesById = async (req, res = response) => {
  const { id } = req.params;
  try {
    const category = await Category.findById(id).populate({
      path: "user",
      select: "email role",
    });
    res.status(200).json({ category });
  } catch (error) {
    console.log(
      colors.red("[Category Error]") +
        " no se ha encontrado ninguna categoría con la id " +
        id
    );
    throw new Error(error);
  }
};

const editCategory = async (req, res = response) => {
  const { id } = req.params;

  const { status, user, ...data } = req.body;
  data.name = data.name.toUpperCase();
  data.user = req.user._id;
  data.role = req.user.role;

  try {
    if (data.role !== "ADMIN_ROLE") {
      return res.status(500).json({ msg: "Unauthorized to edit categories" });
    }
    const category = await Category.findById(id);
    if (!category) {
      return res.status(404).json({ msg: "Categoría not found" });
    }

    const updatedCategory = await Category.findByIdAndUpdate(
      id,
      { name: data.name },
      { new: true }
    ).populate({
      path: "user",
      select: "email role",
    });

    console.log(
      `${colors.green(
        "[Category Update]"
      )} Category ${id} updated succesfully by ${
        updatedCategory.user.email
      } on ${localHour(updatedCategory.updatedAt)} `
    );
    res.status(200).json(updatedCategory);
  } catch (error) {
    console.error(
      colors.red("[Category Error]") +
        " Error al actualizar la categoría: " +
        error
    );
    res.status(500).json({ msg: "Error al actualizar la categoría" });
  }
};

const deleteCategory = async (req, res = response) => {
  const { id } = req.params;

  const { password, status, name, ...data } = req.user;

  const user = data._doc;

  try {
    if (user.role !== "ADMIN_ROLE") {
      return res.status(500).json({ msg: "Unauthorized to edit categories" });
    }
    const category = await Category.findById(id);
    if (!category.status) {
      return res
        .status(404)
        .json({
          msg: "Category not found. Please contact with dataBase admin",
        });
    }

    const deletedCategory = await Category.findByIdAndUpdate(
      id,
      { status: false },
      { new: true }
    ).populate({
      path: "user",
      select: "email role",
    });

    console.log(
      `${colors.magenta(
        "[Category Deleted]"
      )} Category ${id} has been deleted succesfully by ${
        user.email
      } on ${localHour(deletedCategory.updatedAt)} `
    );
    res.status(200).json(deletedCategory);
  } catch (error) {
    console.error(
      colors.red("[Category Error]") +
        " Error al eliminar la categoría: " +
        error
    );
    res.status(500).json({ msg: "Error al eliminar la categoría" });
  }
};

module.exports = {
  createCategory,
  getAllCategories,
  getCategoriesById,
  editCategory,
  deleteCategory,
};
