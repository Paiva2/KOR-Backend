import { Express } from "express";
import { dtoHandler } from "../middlewares/DtoHandler";
import { registerParticipant } from "../dtos/participantDto";
import ParticipantController from "../controllers/participantController";

export default function participantRoutes(app: Express) {
  const participantController = new ParticipantController();

  app.post(
    "/novo-participante",
    [dtoHandler(registerParticipant)],
    participantController.registerParticipant
  );
}
