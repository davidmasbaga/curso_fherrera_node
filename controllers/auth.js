const { response } = require('express')
const colors = require('colors')
const User = require('../models/user')
const bcryptjs = require('bcryptjs')
const { jwtGen } = require('../helpers/jwtGenerator')
const { googleVerify } = require('../helpers/google-verify')
const login = async (req, res = response) => {
    const { email, password } = req.body;

    try {

        //Verificar si existe el correo
        const user = await User.findOne({ email })
        if (!user) {
            return res.status(400).json({ msg: `User ${email} doesn't exist` })
        }

        //Verificar si el usuario está activo
        if (!user.status) {
            return res.status(400).json({ msg: `User ${email} or password doesn't exist. Status Inactive` })
        }
        //Verificar la contraseña
        const validPassword = bcryptjs.compareSync(password, user.password)
        if (!validPassword) {
            return res.status(400).json({ msg: `Password doesn't correct` })
        }

        //Generar el JWT
        const token = await jwtGen(user.id,)


        res.status(200).json({
            user,
            token
        })
    } catch (error) {
        console.log(colors.red(`[Error]: ${error}`));
        res.status(500).json({ msg: 'Algo Salió Mal' })
    }


}


const googleSignIn = async (req, res=response) => {
    const {id_token} = req.body;

    try {
       const {email,name,picture} = await googleVerify(id_token)


       let user =  await User.findOne({email})

       if(!user){
        const data = {
            name:name,
            email:email,
            password:":p",
            image:picture,
            google:true,
            role:"USER_ROLE"
            
        }

       user = new User(data)
        await user.save()
       }
       
if(!user.status){
    return res.status(401).json({
        msg:"User unauthorized"
    })
}

const token = await jwtGen(user.id)

       res.status(200).json({
          user,
        token
    })


    } catch (error) {
        res.status(400).json({
            ok:false,
            msg:"Token not verify"
        })
    }
    

    


}


module.exports = {
    login,
    googleSignIn
}