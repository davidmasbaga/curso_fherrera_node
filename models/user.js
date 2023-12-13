const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = Schema({
  name: {
    type: String,
    required: [true, "El nombre es obligatorio"],
  },
  email: {
    type: String,
    required: [true, "El correo es obligatorio"],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "El correo es obligatorio"],
  },
  image: {
    type: String,
  },
  role: {
    type: String,
    required: true,
    enum: ["ADMIN_ROLE", "USER_ROLE"],
  },
  status:{
    type:Boolean,
    default:true
  },

  google:{
    type:Boolean,
    default:false,
  }
});

// module.exports = mongoose.model('User', UserSchema);

UserSchema.methods.toJSON = function (){
  const {__v, password, ...user} = this.toObject()
  return user

}


const User = mongoose.model('User', UserSchema)

module.exports = User
