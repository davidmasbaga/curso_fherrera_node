const {Router} = require('express')
const {check} = require('express-validator')
const { login, googleSignIn } = require('../controllers/auth')
const { fieldValidator } = require('../middlewares/fieldValidator')
const router = Router()

router.post('/login',
check('email', 'Email is required').isEmail(),
check('password', 'Password is required').not().isEmpty(),
fieldValidator
,login
)


router.post('/google',
check('id_token', 'Google token are required').not().isEmpty(),

fieldValidator
,googleSignIn
)


module.exports=router
