const { response } = require('express')
const jwt = require('jsonwebtoken')
const User = require('../models/user')

const jwtValidate = async (req, res = response, next) => {
    const token = req.header('x-token')

    if (!token) {
        return res.status(401).json({ msg: 'There are not token on your request' })
    }

    try {
        const { uid } = jwt.verify(token, process.env.SECRETJWTKEY)

        //Leer User al que corresponde ID
        const user = await User.findById(uid)

        if (!user) {
            return res.status(401).json({ msg: 'User does not exist on DB' })
        }

        // Verificar si el usuario no ha sido borrado (true stat)
        if (!user.status) {
            return res.status(401).json({ msg: 'Inactive User' })
        }

        req.user = user



        next()
    } catch (error) {
        console.log(error)
        res.status(401).json({ msg: 'It is not a valid token' })
    }




}


module.exports = {
    jwtValidate
}