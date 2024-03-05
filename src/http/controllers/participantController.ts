import { Request, Response } from "express";
import RegisterParticipantService from "../services/participant/registerParticipantService";
import ParticipantModel from "../models/postgres/participantModel";

export default class ParticipantController {
  private participantModel = new ParticipantModel();

  public constructor() {}

  public registerParticipant = async (req: Request, res: Response) => {
    const dto = req.body;

    const registerParticipantService = new RegisterParticipantService(
      this.participantModel
    );

    await registerParticipantService.exec(dto);

    return res
      .status(201)
      .send({ message: "Participante registrado com sucesso." });
  };
}
