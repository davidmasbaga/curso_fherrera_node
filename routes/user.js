const {Router} = require('express')
const {fieldValidator} = require('../middlewares/fieldValidator')
const { getUser, createUser, deleteUser, editUser } = require('../controllers/users')
const router = Router()
const {check} = require('express-validator')
const {isRoleValid,emailExist,userExist} = require('../helpers/dbValidators')



router.get('/', 
getUser
)

router.post('/',[
    check('email', "It is a not valid email").isEmail(),
    check('email').custom(emailExist),
    check('password',"Your password must be more than 6 characters").isLength({min:6}),
    check('name',"The name mustn't be empty").not().isEmpty(),
    // check('role',"The role is not avoid").isIn(['ADMIN_ROLE','USER_ROLE']),
    check('role').custom(isRoleValid),

    fieldValidator
   
],
createUser
)

router.put('/:id',[
check('id', 'Is not a valid ID').isMongoId(),
check('id').custom(userExist),

fieldValidator

],
editUser
)

router.delete('/:id',
deleteUser)



module.exports = router