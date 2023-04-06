const mongoose = require("mongoose")

const awaitadd = new mongoose.Schema({
    username : {type : String , required : true},
    idUser : {type : String , required : true},
    idRes : {type : String , required : true},
    avatarUser : {type : String, required : true},
    idAdd : {type : String , required : true , unique : true},
    idAdd2 : {type : String , required : true , unique : true}
},
    {timestamps : true}
)

module.exports = mongoose.model("awaitAdd", awaitadd)