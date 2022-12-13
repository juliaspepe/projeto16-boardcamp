import express from "express";
import boardgamesRoutes from "./Routers/boardgames.routes.js"

const app = express();
app.use(express.json());
app.use(boardgamesRoutes);

app.listen(4000, () => console.log('Server running in port: 4000'));