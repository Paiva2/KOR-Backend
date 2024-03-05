import { Express } from "express";
import { dtoHandler } from "../middlewares/DtoHandler";
import { createProcessDTO } from "../dtos/processDtos";
import ProcessController from "../controllers/processController";

export default function processRoutes(app: Express) {
  const processController = new ProcessController();

  app.post(
    "/process",
    [dtoHandler(createProcessDTO)],
    processController.newProcess
  );
}
