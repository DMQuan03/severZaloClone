const mongoose = require("mongoose")

const User = new mongoose.Schema({
    username : {type : String , required: true, unique : true},
    password : {type : String , required : true},
    phone : {type : Number , required : true, unique : true, minLength : 10 , maxLength : 11},
    admin : {type : Boolean , default : false},
    celebrity : {type : Boolean , default :false},
    friends : {type : Array , default : []},
    following : {type : Array , required : true},
    avatarUser : {type : String , default : null},
    name : {type : String , required : true},
    sex : {type : Boolean, default : true},
    age : {type : Number , default : 0},
    address : {type : String , default : "VN"},
    wasBorn : {type : String , default : 0},
    listAwait : {type : Array , default : []}
},
    {timestamps : true}
)

module.exports = mongoose.model("user", User)