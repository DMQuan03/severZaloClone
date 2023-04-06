const AwaitAdd = require("../models/awaitAdd")
const User = require("../models/user")

const AwaitAddController = {
    getListOfUser : async(req , res) => {
        try {
            const list = await AwaitAdd.find({idRes : req.user.id})
            // const OnlyUser = User.findOne({ req.user.id })

            return res.status(200).json(list)
        } catch (error) {
            console.log(error)
            return res.status(500).json({
                message : "err from sever",
                code : 500
            })
        }
    }
}

module.exports = AwaitAddController