import "dotenv/config";
import "express-async-errors";
import express, { Express } from "express";
import { pingDb } from "./utils/pingDb";
import bodyParser from "body-parser";
import globalExceptionHandler from "./http/middlewares/globalExceptionHandler";
import routes from "./http/routes";
import swaggerUi from "swagger-ui-express";
import swaggerDoc from "../swaggerDoc.json";

const app: Express = express();

app.use(bodyParser.json());
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDoc));

(async () => {
  await pingDb();
})();

routes(app);

app.use(globalExceptionHandler);

export default app;
