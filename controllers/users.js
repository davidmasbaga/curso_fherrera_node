const { response } = require("express");
const User = require("../models/user.js");
const bcryptjs = require("bcryptjs");
const colors = require("colors");


const getAllUsers = async (req, res) => {

const {limit = '', from = 0} = req.query
const queryStatus = {status:true}

try {
  const [total, users] = await Promise.all([
    User.countDocuments(queryStatus),
    User.find(queryStatus)
    .skip(Number(from))
    .limit(Number(limit))

  ])

    res.status(200).json({total,users});
} catch (error) {
  console.log(
    colors.red("[User Error]") +  " no se ha podido mostrar la lista de usuarios: " + error
  );
  res.status(400).json(error)
}


};

const getUserById = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findById(id);

 
  res.status(200).json(user);
  } catch (error) {
    console.log(colors.red('[User Error]')+ ' no se ha encontrado ningún usuario con la id ' + id)
    throw new Error(error)
  }
  

 

  

  try {
  } catch (error) {
    console.log(error);
  }
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

    res.status(201).json(
      user
    );
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
const  deleteUser = async (req, res = response) => {
const id = req.params.id;

const user = await User.findByIdAndUpdate(id,{status:false})
const authUser = req.user

try {
console.log(colors.magenta(`[User Deleted] `) + `User ${id} has been deleted succesfully` )  
res.status(200).json({msg:`User ${id} has been deleted succesfully`, user})  
} catch (error) {
  res.status(500).json(error)
}

// Método no recomendado
// const user = await User.findByIdAndDelete(id);
// try {
//     res.status(201).json({ msg: `User ${id} has been deleted succesfull`});
//   } catch (error) {
//   res.status(500).json({error:error})
// }

  
};



module.exports = {
  // getUser,
  createUser,
  editUser,
  deleteUser,
  getAllUsers,
  getUserById,
};
