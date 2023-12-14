
const Role = require('../models/role')
const User = require('../models/user')
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
const userExist = async (id='') => {
    const isUserInDB= await User.findById(id);
    console.log(`${colors.yellow('[User Alert]')} the id ${id} do not exist`)
    if (!isUserInDB) {
     throw new Error(`The email: ${id} is registered`)
    }

}


   

    module.exports= {
        isRoleValid,
        emailExist,
        userExist
    }