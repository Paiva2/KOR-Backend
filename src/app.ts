import express, { Express } from "express";
import bodyParser from "body-parser";
import globalExceptionHandler from "./http/middlewares/globalExceptionHandler";
import { pingDb } from "./utils/pingDb";
import "express-async-errors";
import "dotenv/config";

const app: Express = express();

app.use(bodyParser.json());

(async () => {
  await pingDb();
})();

app.use(globalExceptionHandler);

export default app;
