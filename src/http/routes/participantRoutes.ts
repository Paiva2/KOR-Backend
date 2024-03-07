import { Express } from "express";
import { dtoHandler } from "../middlewares/DtoHandler";
import { registerParticipantDTO } from "../dtos/participantDto";
import ParticipantController from "../controllers/participantController";

export default function participantRoutes(app: Express) {
  const participantController = new ParticipantController();

  app.post(
    "/novo-participante",
    [dtoHandler(registerParticipantDTO)],
    participantController.registerParticipant
  );

  app.get("/participantes", participantController.listAllParticipants);
}
