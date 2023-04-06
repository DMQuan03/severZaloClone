const mongoose = require("mongoose")

const Mess = new mongoose.Schema({
    text : {type : String , required : true},
    idRoom : {type : String , required : true},
    username : {type : String , required : true},
    avatarUser : {type : String , required : true},
    idUser : {type : String , required : true}
},
    {timestamps : true}
)

module.exports = mongoose.model("mess", Mess)