
const Role = require('../models/role')
const {User, Category} = require('../models')
const colors = require('colors')


const isRoleValid= async(role='')=>{
    const roleExist = await Role.findOne({role});
        if(!roleExist){
            throw new Error(`Role ${role} is not registered in the database`)
        }
    }


const emailExist = async (email='') => {
    const isEmailInDB= await User.findOne({email:email});
    console.log(`${colors.yellow('[User Alert]')} the email ${email} is registered`)
    if (isEmailInDB) {
     throw new Error(`The email: ${email} is registered`)
    }

}


//Validadores de usuario
const userExist = async (id='') => {
    const isUserInDB= await User.findById(id);
    console.log(`${colors.yellow('[User Alert]')} the id ${id} do not exist`)
    if (!isUserInDB) {
     throw new Error(`The email: ${id} is registered`)
    }

}


//Validadores de categorías

const categoryExists = async (id='') => {
    const isCategoryInDB= await Category.findById(id);
        if (!isCategoryInDB) {
            console.log(`${colors.yellow('[Category Alert]')} the id ${id} does not exist`)
     throw new Error(`${colors.yellow('[Category Alert]')} the id ${id} does not exist`)
    }

}


   

    module.exports= {
        isRoleValid,
        emailExist,
        userExist,
        categoryExists    }