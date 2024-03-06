import { Express } from "express";
import { dtoHandler } from "../middlewares/DtoHandler";
import { insertProcessParticipantDTO } from "../dtos/participantProcessDto";
import ProcessParticipantController from "../controllers/processParticipantController";

export default function participantProcessRoutes(app: Express) {
  const processParticipantController = new ProcessParticipantController();

  app.post(
    "/participante/processo",
    [dtoHandler(insertProcessParticipantDTO)],
    processParticipantController.insertProcessParticipant
  );

  app.get(
    "/processo/:processId/participantes",
    processParticipantController.filterAllProcessParticipants
  );
}
