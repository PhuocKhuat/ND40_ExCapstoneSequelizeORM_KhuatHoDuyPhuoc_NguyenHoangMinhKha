import { io } from "../index.js";
import connectSequelize from "../models/connect.js";
import initModels from "../models/init-models.js";

const initModel = initModels(connectSequelize);

const socketIO = (socket) => {
  console.log("🚀 ~ socketIO ~ socket:", socket.id);

  socket.on("join-room", async (roomId) => {
    socket.join(roomId);

    const dataChat = await initModel.chat.findAll({
      where: {
        room_id: roomId,
      },
    });

    io.to(roomId).emit("data-chat", dataChat);
  });

  socket.on("send-message", async (data) => {
    await initModel.chat.create({
      content: data.content,
      room_id: data.roomId,
      date_time: data.dateTime,
      user_id: data.userId,
    });

    io.to(data.roomId).emit("response-message", data);
  });
};

export default socketIO;
