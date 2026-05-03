const mongoose = require("mongoose");
const bcryptjs = require("bcryptjs");



const userSchema = mongoose.Schema({
    email:{
        type: String,
        required: [true, "Email is required for creating user"],
        trim: true,
        lowercase: true,
        match: [/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, 
            "email is not valid"],
        unique: [true, "email already exists."]
    },
    name:{
        type: String,
        required: [true, "name is required for creating an account"],
    },
    password:{
        type: String,
        required: [true, "password is required."],
        minlength: [8, "password should be atleast 8 characters long"],
        select: false //password will not be extracted when user data is fetched in any query
    },
    systemUser: {
        type: Boolean,
        default: false,
        immutable: true, //systemUser field cannot be modified after user creation
        select: false, // it will not be extracted when user data is fetched in any query
    }
}, {
    timestamps: true
})

//hashing user password
userSchema.pre("save", async function(){
    if(!this.isModified("password")){
        return 
    }

    //hash for password
    const hash = await bcryptjs.hash(this.password, 10)
    this.password = hash

    return 
})

userSchema.methods.comparePasswords = async function (password) {
    return await bcryptjs.compare(password, this.password)    
}

const userModel = mongoose.model("user", userSchema)

module.exports = userModel