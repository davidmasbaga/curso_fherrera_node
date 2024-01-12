const { response } = require("express");
const role = require("../models/role");

const adminRoleValidator = (req, res = response, next) => {
    if (!req.user) {
        return res.status(500).json({
            msg: "You're trying to validate your role. Validate your token first"
        })
    }

    const { role, name } = req.user;

    if (role !== 'ADMIN_ROLE') {
        return res.status(401).json({
            msg: `${name} is not ADMIN`

        })
    }

    next()
}

const hasRole = (...roles) => {
    
    return (req, res = response, next) => {
        if (!req.user) {
            return res.status(500).json({
                msg: "You're trying to validate your role. Validate your token first"
            })
        }
        
        if(!roles.includes(req.user.role)) {
            return res.status(401).json({
                msg: `The service require one of these roles ${roles}`
            })
        }
       
        next();
    }

}


module.exports = {
    adminRoleValidator,
    hasRole

}