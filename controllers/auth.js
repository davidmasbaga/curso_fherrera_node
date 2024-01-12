const { response } = require('express')
const colors = require('colors')
const User = require('../models/user')
const bcryptjs = require('bcryptjs')
const {jwtGen} = require('../helpers/jwtGenerator')
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
        const token = await jwtGen(user.id, )
        

        res.status(200).json({
            user,
            token
        })
    } catch (error) {
        console.log(colors.red(`[Error]: ${error}`));
        res.status(500).json({ msg: 'Algo Salió Mal' })
    }


}


module.exports = {
    login
}