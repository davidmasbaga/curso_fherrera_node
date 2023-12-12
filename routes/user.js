const {Router} = require('express')
const { getUser, createUser, deleteUser, editUser } = require('../controllers/users')
const router = Router()

router.get('/', 
getUser
)

router.post('/',
createUser,
)

router.put('/:id',
editUser
)

router.delete('/:id',
deleteUser)



module.exports = router