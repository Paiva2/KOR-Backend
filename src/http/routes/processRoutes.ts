import { Express } from "express";
import { dtoHandler } from "../middlewares/DtoHandler";
import { createProcessDTO, updateProcessDTO } from "../dtos/processDtos";
import ProcessController from "../controllers/processController";
import tokenHandler from "../middlewares/tokenHandler";

export default function processRoutes(app: Express) {
  const processController = new ProcessController();

  app.post(
    "/processo",
    [tokenHandler, dtoHandler(createProcessDTO)],
    processController.newProcess
  );

  app.get("/processo/:processId", processController.filterProcessWithId);

  app.patch(
    "/processo/:processId",
    [tokenHandler, dtoHandler(updateProcessDTO)],
    processController.updateProcessInfos
  );
}
