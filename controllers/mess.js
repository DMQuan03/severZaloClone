const mess = require("../models/mess")

const MessController = {
    getMessOfRoom : async(req , res) => {
        try {
            const listMess = await mess.find({idRoom : req.params.idRoom})
            return res.status(200).json(listMess)
        } catch (error) {
            return res.status(500)
        }
    }
}

module.exports = MessController