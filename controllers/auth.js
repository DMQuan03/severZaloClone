const User = require("../models/user")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")

const authController = {

    registerUser : async(req , res) => {
        try {
            const salt = await bcrypt.genSalt(10)
            const hashed = await bcrypt.hash(req.body.password, salt)

            const user = await new User({
                username : req.body.username,
                password : hashed,
                phone : req.body.phone,
                name : req.body.name,
                avatarUser : req.body.avatar
            })

            const newUser = await user.save()

            return res.status(200).json(newUser)

        } catch (error) {
            console.log(error)
            return res.status(500).json({
                message : "error from sever",
                code : 500
            })
        }
    },

    loginUser : async(req , res) => {
        const user = await User.findOne({ username : req.body.username })

        if (!user) return res.status(404).json({message : "wrong username"})

        const isPassword = bcrypt.compare(
            req.body.password,
            user.password
        )

        if (!isPassword) return res.status(404).json({message : "wrong password"})

        if (user && isPassword) {
            const accessToken = jwt.sign({
                id : user._id,
                admin : user.admin,
                avatar : user.avatarUser,
                name : user.name
            },
                process.env.MY_ACCESS_TOKEN,
                {expiresIn : "2d"}            
            )

            const {password , ...other} = user._doc
            return res.status(200).json({...other , accessToken})
        }
    },

    getUser : async(req , res) => {
        try {
            const list = await User.find()
            const user = await list.filter((docs) => {
                return docs.username.includes(req.query.q)
            })


            return res.status(200).json(user)
        } catch (error) {
            console.log(error)
            return res.status(500).json({
                message : "err from sever",
                code : 500
            })
        }
    },
    verifyToken : async(req , res, next) => {
        const AuthorizationHeader = req.headers["authorization"]
        const token = AuthorizationHeader.split(" ")[1]

        if(!token) return res.status(403)

        jwt.verify(token, process.env.MY_ACCESS_TOKEN, (err , user) => {
            if (err) {
                console.log(err) 
                return res.status(404).json({message : "token is'nt valid"})
            }
            req.user = user
            next()
        })
    },

    getListFr : async(req , res) => {
        try {
            const onLyUser = await User.findOne({ _id : req.user.id })
            const allUser = await User.find()


            const result = await allUser.filter((ls) => {
                return onLyUser.friends.includes(ls._id)
            })


            return res.status(200).json(result)
        } catch (error) {
            console.log(error)
            return res.status(500).json({message : "err from sever", code : 500})
        }
    }

}

module.exports = authController