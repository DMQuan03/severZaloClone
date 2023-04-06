const mongoose = require("mongoose")

const newRoom = new mongoose.Schema({
    idRoom1 : {type : String , required : true , unique : true},
    idRoom2 : {type : String , required : true , unique : true},
    idAdmin : {type : String , required : true},
    idUser : {type : String , required : true},
    avatarUser1 : {type : String , required : true},
    avatarUser2 : {type : String , required : true},
    member : {type : Array , default : []},
    nameUser1 : {type :String , required : true},
    nameUser2 : {type :String , required : true}
})

module.exports = mongoose.model("rooms", newRoom)