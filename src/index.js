import express from 'express';
import rootRouter from './routes/rootRouter.js';

const app = express();

const port = 8080;
app.listen(port, () => {
console.log(`App run on http://localhost:${port}`);
});

app.use(rootRouter);
