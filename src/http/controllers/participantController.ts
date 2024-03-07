import { Request, Response } from "express";
import ParticipantFactory from "./factories/participantFactory";
import { listParticipantsQueryDTO } from "../dtos/participantDto";
import z from "zod";
import BadRequestException from "../exceptions/badRequestException";

export default class ParticipantController {
  private factory = new ParticipantFactory();

  public constructor() {}

  public registerParticipant = async (req: Request, res: Response) => {
    const dto = req.body;

    const { registerParticipantService } = await this.factory.exec();

    await registerParticipantService.exec(dto);

    return res
      .status(201)
      .send({ message: "Participante registrado com sucesso." });
  };

  public listAllParticipants = async (req: Request, res: Response) => {
    listParticipantsQueryDTO.parse(req.query);

    type queryType = z.infer<typeof listParticipantsQueryDTO>;

    const dto = req.query as queryType;

    const { listAllParticipantsService } = await this.factory.exec();

    const listOfParticipants = await listAllParticipantsService.exec(dto);

    return res.status(200).send(listOfParticipants);
  };
}
