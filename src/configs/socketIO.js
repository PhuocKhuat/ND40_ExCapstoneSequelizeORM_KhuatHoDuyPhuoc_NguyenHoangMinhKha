import { io } from "../index.js";
import connectSequelize from "../models/connect.js";
import initModels from "../models/init-models.js";

const initModel = initModels(connectSequelize);

const socketIO = (socket) => {
  console.log("🚀 ~ socketIO ~ socket:", socket.id);

  socket.on("send-message", async (data) => {
    await initModel.chat.create({
      content: data.content,
      date_time: data.dateTime,
      user_id: data.userId,
    });

    io.emit("response-message", data);
  });
};

export default socketIO;
