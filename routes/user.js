const { Router } = require('express')
const { check } = require('express-validator')

const {
  fieldValidator,
  jwtValidate,
   adminRoleValidator, 
   hasRole

} = require('../middlewares')



const { getUser, createUser, deleteUser, editUser, getAllUsers, getUserById } = require('../controllers/users')
const { isRoleValid, emailExist, userExist } = require('../helpers/dbValidators')


const router = Router()






// router.get('/', 
// getUser
// )

router.get('/',

  [
    check('limit', 'The limit has to be a number').optional().isNumeric(),
    check('from', 'Init value has to be a number').optional().isNumeric(),
    fieldValidator
  ]

  , getAllUsers
)
router.get('/:id', getUserById
)

router.post('/', [
  check('email', "It is a not valid email").trim().isEmail(),
  check('email').trim().custom(emailExist),
  check('password', "Your password must be more than 6 characters").trim().isLength({ min: 6 }),
  check('name', "The name mustn't be empty").trim().not().isEmpty(),
  // check('role',"The role is not avoid").isIn(['ADMIN_ROLE','USER_ROLE']),
  check('role').custom(isRoleValid),

  fieldValidator

],
  createUser
)

router.put('/:id', [

  check('id', 'Is not a valid ID').trim().isMongoId(),
  check('id').trim().custom(userExist),

  fieldValidator

],
  editUser
)

router.delete('/:id', [
  jwtValidate,
  adminRoleValidator,
  hasRole('ADMIN_ROLE'),
  check('id', 'Is not a valid ID').trim().isMongoId(),
  check('id').trim().custom(userExist),
  fieldValidator
],
  deleteUser)



module.exports = router