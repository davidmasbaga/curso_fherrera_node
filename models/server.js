
const express = require('express')
const cors = require('cors');
const { dbConnection } = require('../database/config');
const colors = require('colors')


//crear una instancia de la clase
class Server {
    constructor() {

        this.app = express();
        this.port = process.env.PORT;

        this.paths={
            auth:'/api/auth',
            search:'/api/search',
            users:'/api/users',
            categories: '/api/categories',
            products: '/api/products',
           
        }



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
        this.app.use(this.paths.auth, require('../routes/auth'))
        this.app.use(this.paths.search, require('../routes/search'))
        this.app.use(this.paths.users, require('../routes/user'))
        this.app.use(this.paths.categories, require('../routes/categories'))
        this.app.use(this.paths.products, require('../routes/products'))
        


    }


    listen() {

        this.app.listen(this.port, () => {
            console.log(`${colors.cyan('[Conexión al Servidor]')} Servidor corriendo en puerto ${this.port}`)
        })
    }


}

module.exports = Server;