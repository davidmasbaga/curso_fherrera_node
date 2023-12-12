
const express = require('express')
const cors = require('cors')


//crear una instancia de la clase
class Server {
    constructor() {

        this.app = express();
        this.port = process.env.PORT;
        this.usersPath = '/api/users'


        //Middlewares

        this.middlewares();
        //Routes
        this.routes()

    }

    middlewares() {
        //CORS
        this.app.use(cors())
        //Lectura y parseo del body
        this.app.use( express.json())

        //directorio público
        this.app.use(express.static('public'))

    }

    routes() {
     this.app.use(this.usersPath, require('../routes/user'))
        
    }
    

    listen() {

        this.app.listen(this.port, () => {
            console.log('Servidor corriendo en puerto ' + this.port)
        })
    }


}

module.exports = Server;