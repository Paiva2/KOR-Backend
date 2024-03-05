import express, { Express } from "express";
import bodyParser from "body-parser";
import globalExceptionHandler from "./http/middlewares/globalExceptionHandler";
import "express-async-errors";
import "dotenv/config";

const app: Express = express();

app.use(bodyParser.json());

app.use(globalExceptionHandler);

export default app;
