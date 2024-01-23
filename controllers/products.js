const { response } = require(`express`);
const { Product } = require(`../models`);
const colors = require(`colors`);
const { localHour } = require(`../helpers/utils`);

const dataType= 'Product'

const createProduct = async (req, res = response) => {
    const {status, ...body} = req.body
  
  const user = req.user

  const nameUpperCase = body.name.toUpperCase();
  const productDB = await Product.findOne({name: nameUpperCase});

  if (productDB) {
    return res.status(400).json({ msg: `${productDB.name} already exist` });
  }

  if (user.role !== `ADMIN_ROLE`) {
    return res.status(500).json({ msg: `Unauthorized role to create a new ${dataType}` });
  }

  const data = {
    ...body,
    name: nameUpperCase,
    user: req.user._id,
  };

  const product = new Product(data);

  try {
    await product.save();
    res.status(200).json(product);
  } catch (error) {
    // Manejar error aquí
    res.status(500).json({ msg: `Error al guardar el producto`, error });
  }
};

const getAllProducts = async (req, res = response) => {
  const { limit = ``, from = 0 } = req.query;
  const queryStatus = { status: true };

  try {
    const [total, products] = await Promise.all([
      Product.countDocuments(queryStatus),
      Product.find(queryStatus)
        .populate({
          path: `user`,
          select: `email role`,
        })
        .populate({
            path:'category',
            select:'name'
        })
        .skip(Number(from))
        .limit(Number(limit)),
    ]);
    res.status(200).json({ total, products });
  } catch (error) {
    console.log(
      colors.red(`[${dataType} Error]`) +
        ` we can't show you the ${dataType} list: ` +
        error
    );
    res.status(400).json(error);
  }
};

const getProductsById = async (req, res = response) => {
  const { id } = req.params;
  try {
    const product = await Product.findById(id).populate({
      path: `user`,
      select: `email role`,
    });
    res.status(200).json({ product});
  } catch (error) {
    console.log(
      colors.red(`[${dataType} Error]`) +
        ` there are not ${dataType} con la id ` +
        id
    );
    throw new Error(error);
  }
};

const editProduct = async (req, res = response) => {
  const { id } = req.params;

  const { status, user, ...data } = req.body;
  data.name = data.name.toUpperCase();
  
  const role = req.user.role;
  const userEmail = req.user.email
  
  

 

  try {
    if (role !== `ADMIN_ROLE`) {
      return res.status(500).json({ msg: `Unauthorized to edit ${dataType}` });
    }
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ msg: `${dataType} not found` });
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      data,
      { new: true }
    )
    
    
    console.log(
      `${colors.green(
        `[${dataType} Update]`
      )} ${dataType} ${id} updated succesfully by ${
        userEmail
      } on ${localHour(updatedProduct.updatedAt)} `
    );
    res.status(200).json(updatedProduct);
  } catch (error) {
    console.error(
      colors.red(`[${dataType} Error]`) +
        ` Error to update the ${dataType}: ` +
        error
    );
    res.status(500).json({ msg: `Error to update the ${dataType}` });
  }
};

const deleteProduct = async (req, res = response) => {
  const { id } = req.params;

  const { ...data } = req.user;
  console.log(data)

  const user = data._doc;

  try {
    if (user.role !== `ADMIN_ROLE`) {
      return res.status(500).json({ msg: `Unauthorized to edit ${dataType}` });
    }
    const category = await Product.findById(id);
    if (!category.status) {
      return res
        .status(404)
        .json({
          msg: `${dataType} not found. Please contact with dataBase admin`,
        });
    }

    const deletedProduct = await Product.findByIdAndUpdate(
      id,
      { status: false },
      { new: true }
    )

    console.log(
      `${colors.magenta(
        `[${dataType} Deleted]`
      )} ${dataType} ${id} has been deleted succesfully by ${
        user.email
      } on ${localHour(deletedProduct.updatedAt)} `
    );
    res.status(200).json(deletedProduct);
  } catch (error) {
    console.error(
      colors.red(`${dataType} Error]`) +
        ` Error to delete ${dataType}: ` +
        error
    );
    res.status(500).json({ msg: `Error to delete ${dataType}` });
  }
};

module.exports = {
createProduct,
  getAllProducts,
  getProductsById,
  editProduct,
  deleteProduct,
};
