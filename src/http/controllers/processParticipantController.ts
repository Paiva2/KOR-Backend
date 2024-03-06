import { Request, Response } from "express";
import ParticipantProcessFactory from "./factories/participantProcessFactory";

export default class ProcessParticipantController {
  private factory = new ParticipantProcessFactory();

  public constructor() {}

  public insertProcessParticipant = async (req: Request, res: Response) => {
    const dto = req.body;

    const { insertProcessParticipantService } = await this.factory.exec();

    await insertProcessParticipantService.exec(dto);

    return res
      .status(201)
      .send({ message: "Participante inserido com sucesso no processo." });
  };
}
