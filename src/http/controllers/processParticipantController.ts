import { Request, Response } from "express";
import ParticipantProcessFactory from "./factories/participantProcessFactory";
import { filterProcessParticipantsByIdDTO } from "../dtos/participantProcessDto";
import z from "zod";

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

  public filterAllProcessParticipants = async (req: Request, res: Response) => {
    filterProcessParticipantsByIdDTO.parse(req.query);

    type queryType = z.infer<typeof filterProcessParticipantsByIdDTO>;

    const dto = req.query as queryType;

    const { processId } = req.params;

    const { filterProcessParticipantsService } = await this.factory.exec();

    const list = await filterProcessParticipantsService.exec({
      ...dto,
      processId,
    });

    return res.status(200).send(list);
  };
}
