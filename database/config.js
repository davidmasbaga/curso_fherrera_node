const mongoose = require('mongoose')
const colors = require('colors')


const dbConnection = async () => {
    try {
        mongoose.connect(process.env.MONGODB_URI)

        console.log( `${colors.cyan('[Conexión a la Base de Datos]')} Base de datos conectada ✅`)

    } catch (error) {
        throw new Error('Error al iniciar la base de datos')
    }
}

module.exports = {
    dbConnection
}