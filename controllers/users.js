const { response } = require("express");
const User = require("../models/user.js");
const bcryptjs = require("bcryptjs");
const colors = require("colors");

const getUser = (req, res = response) => {
  const { q, nombre = "No name", apikey } = req.query;

  res.status(201).json({ msg: "get API - Controller", q, nombre, apikey });
};
const createUser = async (req, res = response) => {
  try {
    const { name, email, password, role } = req.body;

    const user = new User({
      name: name,
      email: email,
      password: password,
      role: role,
    });

    //Encriptar la contraseña
    const salt = bcryptjs.genSaltSync(10);
    user.password = bcryptjs.hashSync(password, salt);

    //Guardar en base de datos

    await user.save();

    console.log(
      `${colors.green(
        `${colors.green("[User New]")}${colors.white(
          ` Usuario ${user.id} guardado con éxito`
        )} `
      )}`
    );

    res.status(201).json({
      user,
    });
  } catch (error) {
    console.log(`${colors.red("error")}:`, error);
    res.status(404).json({ msg: "error al guardar el usuario" });
  }
};
const editUser = async (req, res = response) => {
  const id = req.params.id;
  const { password, google, role, ...restOfUserObject } = req.body;
  try {
    //Validar password si nos lo mandan para cambiar
    if (password) {
      const salt = bcryptjs.genSaltSync(10);
      restOfUserObject.password = bcryptjs.hashSync(password, salt);
    }

    const user = await User.findByIdAndUpdate(id, restOfUserObject);

    console.log(
      `${colors.green("[User Update]")} usuario ${id} actualizado correctamente`
    );
    res.status(201).json(user);
  } catch (error) {
    console.log(colors.red(`[Error]:`) + `Error al editar usuario ${id}`);
    throw new Error(error);
  }
};
const deleteUser = (req, res = response) => {
  res.status(201).json({ msg: "delete API - Controller" });
};

module.exports = {
  getUser,
  createUser,
  editUser,
  deleteUser,
};
