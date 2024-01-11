const jwt = require('jsonwebtoken')



const jwtGen = (uid='') => {
    return new Promise((resolve, reject) => {
        const payload ={uid};

        jwt.sign(payload, process.env.SECRETJWTKEY, {expiresIn:'4h'},
        
        (err,token)=>{

            if(err){
                console.log(err)
                reject('It has not been possible to generate your JWT')
            } else{
                resolve(token)
            }
        })

    })


}

module.exports = {
    jwtGen
}