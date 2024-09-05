const fs = require('fs');
const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
const env = dotenv.config();

const app = express();
const https = require('https');

const socketio = require('socket.io');

const server = https.createServer({
    key:fs.readFileSync(path.join(__dirname,'server.key')),
    cert:fs.readFileSync(path.join(__dirname,'server.cert'))
},app);

const io = socketio(server);

app.set('view engine','hbs');
app.use(express.static(path.join(__dirname,'public')));

io.on("connection",(socket)=>{
    socket.on("send-location",(data) => {
        io.emit("receive-location", {id: socket.id, ...data})
        console.log("connected"+socket.id)
    })
    socket.on("disconnect",()=>{
        io.emit('user-disconnect',socket.id)
        console.log("disconnected"+socket.id)
    })
});

app.get("/",(req,res)=>{
    res.render("index");
})

server.listen(process.env.port,()=>{
    console.log('Server started on https://localhost:'+process.env.port);
});