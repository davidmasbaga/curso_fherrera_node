
const express = require('express')
const cors = require('cors');
const { dbConnection } = require('../database/config');
const colors = require('colors')


//crear una instancia de la clase
class Server {
    constructor() {

        this.app = express();
        this.port = process.env.PORT;
        this.usersPath = '/api/users'
        this.authPath = '/api/auth'

        //Conexion a base de datos
        this.connectDb()
        //Middlewares

        this.middlewares();
        //Routes
        this.routes()

    }

    async connectDb() {
        await dbConnection()

    }

    middlewares() {
        //CORS
        this.app.use(cors())
        //Lectura y parseo del body
        this.app.use(express.json())

        //directorio público
        this.app.use(express.static('public'))

    }

    routes() {
        this.app.use(this.authPath, require('../routes/auth'))
        this.app.use(this.usersPath, require('../routes/user'))


    }


    listen() {

        this.app.listen(this.port, () => {
            console.log(`${colors.cyan('[Conexión al Servidor]')} Servidor corriendo en puerto ${this.port}`)
        })
    }


}

module.exports = Server;