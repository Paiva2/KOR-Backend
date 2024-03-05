import express, { Express } from "express";
import bodyParser from "body-parser";
import globalExceptionHandler from "./http/middlewares/globalExceptionHandler";
import { pingDb } from "./utils/pingDb";
import routes from "./http/routes";
import "express-async-errors";
import "dotenv/config";

const app: Express = express();

app.use(bodyParser.json());

(async () => {
  await pingDb();
})();

routes(app);

app.use(globalExceptionHandler);

export default app;
