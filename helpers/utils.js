const moment = require ('moment-timezone')


const localHour= (timeStamp, timezone='Europe/Madrid')=>{
    
const localHour =   moment(timeStamp).tz(timezone).format('D-MM-YYYY, ddd, HH:mm:ss')

return localHour
}

localHour('2024-01-11T15:19:02.040Z',"Europe/Madrid")



module.exports={
    localHour
}