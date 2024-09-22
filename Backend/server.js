const express = require("express");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");


const controller = require("./controller");

const app = express();
const server = http.createServer(app);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

const routes = require('./routes');
app.use('/', routes);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

io.on("connection", (socket) => {
  console.log("New client connected, ID: ", socket.id);
  socket.on("selfroom", async (username) => {
    try {
      console.log("Joining username: ", username);
      const ids = await controller.getRoomIds(username);
      console.log("Room IDs: ", ids);
      socket.join(username);
      ids.forEach((roomId) => {
        socket.join(roomId);
        console.log(`Joined room: ${roomId}`);
      });
    } catch (err) {
      console.error("Error fetching room IDs: ", err);
    }
  });
  

  socket.on("join_room", (roomId) => {
    console.log(`Joining room: ${roomId}, Socket ID: ${socket.id}`);
    socket.join(roomId);

    //socket.to(roomId).emit("new_user_joined", { userId: socket.id });
  });

  socket.on("send_message_all", (data) => {
    console.log("Sending Message: ", data);
    socket.broadcast.emit("receive_message", data);
  });

  socket.on("create_room",(data)=>{
    console.log(socket.id ," joining (cr) ",data);
    socket.join(data.roomId);
    socket.to(data.usernames[1]).emit("invite_to_room",data);
  })
    
  socket.on("send_message", (data) => {
    console.log("Sending Message: ", data);
    socket.to(data.roomId).emit("receive_message", data.message);
  });


  socket.on("get_rooms", () => {
    const rooms = Array.from(socket.rooms);
    console.log("Current joined rooms:", rooms);
  });

  socket.on('send_image', async (data) => {
    const { roomId, image } = data;
    socket.to(roomId).emit('receive_image', { message, image });
  });


  socket.on ("update_seen",(data)=>{
    console.log("Updating seen",data);
    socket.to(data.roomId).emit("listen_seen_update",data);
  });

  socket.on("update_seen_for_all",(data)=>{
    console.log("Update senn for all server ",data);
    controller.updateSeenForAll(data.username,data.roomId);
    socket.to(data.roomId).emit("listen_update_seen_for_all",data.username);

  })

  socket.on("disconnect", (reason) => {
    console.log("Disconnected: ", socket.id, " due to ", reason);
  });
});

server.listen(8000, () => {
  console.log("Server running on port 8000");
});
