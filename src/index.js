import express from "express";
import rootRouter from "./routes/rootRouter.js";
import cors from "cors";
import { createServer } from "http";
import { Server } from "socket.io";
import socketIO from "./configs/socketIO.js";

const app = express();

app.use(cors());

const port = 8080;
app.listen(port, () => {
  console.log(`App run on http://localhost:${port}`);
});

app.use(express.json());
app.use(express.static("./public/imgs"));
app.use(rootRouter);

const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: "*",
  },
});
io.on("connection", socketIO);

httpServer.listen(8081);

export { io };
