const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const chats = require('./model/chats');
const users = require('./model/users');
const rating = require('./model/rating');
const mongoose =  require('mongoose');

 mongoose.connect('mongodb://localhost:27017/chat-app');

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {

    // default joining to room1
    socket.join('room1');

    // chat-message consume
    socket.on('send-chat-message',message=>{
        users.findOne({'socketId':socket.id}).then(userData=>{
            const chatMessageObj =  new chats({
                userName: userData.name,
                userId : socket.id,
                message: message,
                room: "room1",
                createdOn : new Date()
            });

            chatMessageObj.save().then(savedData=>{
                socket.broadcast.emit('chat-message',{message:message , name : userData.name});
             })
        })
       
    })

    // new user added 
    socket.on('new-user',name=>{

       const user = new users({
            name: name,
            room: "room1",
            socketId : socket.id,
            isActive: true
        })
        user.save().then(userData=>{
            socket.broadcast.emit('user-connected',name);
        })
    })


    // getting old chat
        socket.on('old-chat',name=>{
            chats.find({'room':'room1'}).sort({"createdOn":1}).then(oldChats=>{
                console.log("oldChats",oldChats);
                socket.emit('get-old-chat',oldChats);
            });
    })

    // new user added 
    socket.on('send-rating',ratingValue=>{

        users.findOne({'socketId':socket.id}).then(userData=>{
            const ratingObj = new rating({
                name: userData.name,
                room: "room1",
                socketId : socket.id,
                rating: ratingValue
            })
            ratingObj.save().then(userData=>{
                console.log(userData);
            })
        });
        
     })

    // disconnected user
    socket.on('disconnect',()=>{
        users.findOneAndUpdate({'socketId':socket.id},{'$set':{'isActive':false}},{new:true}).then(userData=>{
            console.log(userData);
            socket.broadcast.emit('user-disconnected',userData.name);
        })
    })
  });


server.listen(3000, () => {
  console.log('listening on *:3000');
});
