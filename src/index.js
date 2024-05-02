import express from "express";
import rootRouter from "./routes/rootRouter.js";
import cors from "cors";

const app = express();

app.use(cors());

const port = 8080;
app.listen(port, () => {
  console.log(`App run on http://localhost:${port}`);
});

app.use(express.json());

app.use(express.static("./public/imgs"));

app.use(rootRouter);
