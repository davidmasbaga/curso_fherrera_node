 const  {fieldValidator}  = require('./fieldValidator')
 const  {jwtValidate}  = require('./validateJwt')
 const { adminRoleValidator, hasRole } = require('./roleValidator')



 module.exports = {
    fieldValidator,
    jwtValidate,
    adminRoleValidator,
    hasRole
 }