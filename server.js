const express = require("express")
const dotenv = require("dotenv")
const mongoose = require("mongoose")
const jwt = require("jsonwebtoken")
const app = express()
const http = require('http')
const uuidV4 = require("uuid")

const { Server } = require("socket.io")
const cors = require("cors")

const AuthRoutes = require("./routes/auth")
const AwaitAddRoutes = require("./routes/awaitadd")
const roomRoutes = require("./routes/room")
const messRouter = require("./routes/mess")
const addRequest = require("./models/awaitAdd")
const awaitAdd = require("./models/awaitAdd")
const user = require("./models/user")
const room = require("./models/rooms")
const mess = require("./models/mess")



app.use(express.json())
app.use(cors())
dotenv.config()

const PORT = process.env.PORT || 5043
const server = http.createServer(app)
mongoose.connect("mongodb://127.0.0.1:27017/Zalo")




const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST", "PUT", "PATCH", "DELETED"]
    }
})

app.use("/v1/auth/", AuthRoutes )
app.use("/v1/awaitAdd", AwaitAddRoutes)
app.use("/v1/room/", roomRoutes)
app.use("/v1/mess/", messRouter)

io.use(function (socket, next) {
    if (socket.handshake.query && socket.handshake.query.token) {
        jwt.verify(socket.handshake.query.token, process.env.MY_ACCESS_TOKEN, function (err, decoded) {
            if (err) {
                return 1
            }
            socket.decoded = decoded;
            next();
        });
    }
    else {
        console.log("err")
        return 2
    }
})

io.on("connection", (socket) => {


    socket.username = socket.decoded.name
    socket.avatarUser = socket.decoded.avatar
    socket.userId = socket.decoded.id
    socket.join(socket.decoded.id)


    // console.log("user------------" + socket.decoded.username + "--------------vua connect to server")


   socket.on("request_add_to_user", async(data) => {
        try {
            socket.join(data.userId)

            const listAwait = await awaitAdd.find()
            const onlyUser = await user.findOne({ _id : data.userId })


            const results = listAwait.every((ls) => {
                return ls.idAdd !== data.userId + socket.userId && ls.idAdd2 !== socket.userId + data.userId2
            })

            const check2 = onlyUser.listAwait.includes(socket.userId)
            const check3 = onlyUser.friends.includes(socket.userId)


            if (results === true && check2 === false && check3 === false) {
                const newRequest = await new addRequest({
                    username : socket.username,
                    idUser : socket.userId,
                    avatarUser : socket.avatarUser,
                    idAdd : socket.userId + data.userId,
                    idAdd2 :  data.userId + socket.userId,
                    idRes : data.userId
                }) 

                await user.updateOne({ _id : data.userId }, {$addToSet : { listAwait : socket.userId }})
    
                const result = await newRequest.save()
                socket.broadcast.to(data.userId).emit("server_return_a_request", result)
                socket.leave(data.userId)

            }else {
                return 0
            }
        } catch (error) {
            console.log(error)
        }
   })

   socket.on("add_fr", async(data) => {
        try {
            await user.updateOne({ _id : socket.userId}, {$addToSet : { friends : data.userId }})
            await user.updateOne({ _id : data.userId}, {$addToSet : { friends : socket.userId }})
            await user.updateOne({ _id : socket.userId }, {$pull : { listAwait : data.userId }})
            await awaitAdd.deleteOne({ _id : data.id })
            const roomNew = await new room({
                idRoom1 : socket.userId + data.userId,
                idRoom2 : data.userId + socket.userId,
                idAdmin : socket.userId,
                idUser : data.userId,
                avatarUser1 : socket.avatarUser,
                avatarUser2 : data.avatarUser2,
                member : [
                    socket.userId,
                    data.userId
                ],
                nameUser1 : socket.username,
                nameUser2 : data.username,
            })

         
            await roomNew.save()
        } catch (error) {
            console.log(error)
        }
   })

   socket.on("new_room", async (data) => {
        try {
            soc
        } catch (error) {
            console.log(error)
        }
   })

   socket.on("join_room", (data) => {
    console.log(data)
    socket.join(data.idRoom)
   })

   socket.on("send_mess", async(data) => {
        try {
            socket.join(data.idRoom)
            const newMess = await new mess({
                text : data.text,
                idRoom : data.idRoom,
                username : socket.username,
                avatarUser : socket.avatarUser,
                idUser : socket.userId
            })


            const messTrue = await newMess.save()
            io.sockets.to(data.idRoom).emit("return_mess", newMess)
        } catch (error) {
            console.log(error)
        }
   })



    // socket.on("connect_error", (err) => {
    //     console.log(`connect_error due to ${err.message}`);
    // });

    // socket.on("disconnect", () => {
    //     console.log("user---------" + socket.id + "----------disConnect")
    // })
})



server.listen(PORT, () => {
    console.log(`server is running from ${PORT} `)
})