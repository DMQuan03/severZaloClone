const rooms = require("../models/rooms")
const user = require("../models/user")


const roomController = {
    getRoomOnly : async(req , res) => {
        console.log(req.body.room)
        try {
            const ROOMS = await  rooms.find()

            const room = await ROOMS.filter((rm) => {
                return rm.member.includes(req.user.id)
            })


            return res.status(200).json(room)
        } catch (error) {
            console.log(error)
            return res.status(500)
        }
    },
    getdataRoom : async(req , res) => {
        console.log(req.params.id)
        try {
            const dataRoom = await rooms.findOne({_id : req.params.id})

            return res.status(200).json(dataRoom)
        } catch (error) {
            console.log(error)
            return res.status(500)
        }
    }
}

module.exports = roomController