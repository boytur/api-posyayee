const mongoose = require('mongoose')
const jwt = require('jsonwebtoken');
require('dotenv').config();
const joi = require('joi');
const passComPlex = require('joi-password-complexity')

const userSchema = new mongoose.Schema({
    username:
    {
        type:String,
        required:true,
        default:"sangjun"
    }
    ,
    password:{
        type:String,
        required:true,
        default:"sangjun@posyayee"
    }
    ,
    email:{
        type:String,
        required:true,
    }
})

userSchema.methods.generateAuthToken = function(){
    const token = jwt.sign({_id:this._id},process.env.IDSIGN,{expiresIn:"7d"})
    return token
}

const User = mongoose.model("user",userSchema);
const validate = (data) => {
    const schema = joi.object({
        username:joi.string().required().label("Username"),
        password:passComPlex().required().label("Password"),
        email:joi.string().email().required().label("Email")
    })
    return schema.validate(data);
}
module.exports = {User,validate};