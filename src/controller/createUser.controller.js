const User = require("../model/createUser.model");
const apiResponse = require("../utils/apiResponse");

exports.createUserController=async(req,res)=>{
    const{name,email,password}=req.body
    const existingUser=await User.findOne({email})
    if(existingUser){
        return apiResponse(res,400,"User already exists")
    }
    const newUser=new User({name,email,password})
    await newUser.save()
    return apiResponse(res,201,"User created successfully",newUser)
}