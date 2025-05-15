import express from "express";
import cors from "cors";
import helmet from "helmet";
import { mainRouter } from "./routers/main";

const server = express();

server.use(cors());
server.use(helmet());
server.use(express.urlencoded({ extended: true }));
server.use(express.json());

server.use(mainRouter);

server.listen(process.env.PORT || 3001, () => {
    console.log(`Server is running on ${process.env.BASE_URL}`);
});