const {response} = require('express')

const getUser = (req, res=response) => {

    const {q, nombre = 'No name', apikey} = req.query

    res.status(201).json({msg: 'get API - Controller', q, nombre, apikey})
}
const createUser = (req, res=response) => {
    const {nombre, edad} = req.body
   

    

    res.status(201).json({
        msg: 'post API - Controller',
        nombre, 
        edad
    })
}
const editUser = (req, res=response) => {
    const id = req.params.id

  
    res.status(201).json({msg: 'put API - Controller', id})
    

    
}
const deleteUser = (req, res=response) => {
    res.status(201).json({msg: 'delete API - Controller'})
}


module.exports={
getUser,
createUser,
editUser,
deleteUser


}