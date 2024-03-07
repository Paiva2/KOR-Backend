import { Request, Response } from "express";
import ProcessFactory from "./factories/processFactory";
import JwtService from "../services/jwt/jwtService";
import { listAllProcessDTO } from "../dtos/processDtos";
import z from "zod";

export default class ProcessController {
  private factory = new ProcessFactory();
  private jwtService = new JwtService();

  public constructor() {}

  public newProcess = async (req: Request, res: Response) => {
    const dto = req.body;

    const { createNewProcessService } = await this.factory.exec();

    const parseSubjectToken = this.jwtService.decode(
      req.headers.authorization!.replace("Bearer ", "")
    );

    const newProcess = await createNewProcessService.exec(
      parseSubjectToken!,
      dto
    );

    return res.status(201).send({
      message: "Processo criado com sucesso.",
      processo: {
        id: newProcess.id,
        number: newProcess.number,
      },
    });
  };

  public filterProcessWithId = async (req: Request, res: Response) => {
    const { processId } = req.params;

    const { filterProcessById } = await this.factory.exec();

    const getProcess = await filterProcessById.exec(processId);

    return res.status(200).send(getProcess);
  };

  public updateProcessInfos = async (req: Request, res: Response) => {
    const dto = req.body;
    const { processId } = req.params;

    const parseSubjectToken = this.jwtService.decode(
      req.headers.authorization!.replace("Bearer ", "")
    );

    const { updateProcessInfosService } = await this.factory.exec();

    const performUpdate = await updateProcessInfosService.exec(
      parseSubjectToken,
      processId,
      dto
    );

    return res.status(200).send({
      message: "Processo atualizado com sucesso.",
      processUpdated: performUpdate,
    });
  };

  public deleteProcessById = async (req: Request, res: Response) => {
    const { processId } = req.params;

    const parseSubjectToken = this.jwtService.decode(
      req.headers.authorization!.replace("Bearer ", "")
    );

    const { deleteProcessService } = await this.factory.exec();

    await deleteProcessService.exec(parseSubjectToken, processId);

    return res.status(200).send({
      message: "Processo deletado com sucesso.",
    });
  };

  public listAllProcess = async (req: Request, res: Response) => {
    listAllProcessDTO.parse(req.query);

    type queryType = z.infer<typeof listAllProcessDTO>;

    const queries = req.query as queryType;

    const { filterProcessByParams } = await this.factory.exec();

    const getProcessList = await filterProcessByParams.exec({
      ...queries,
      participant: queries.participante,
      client: queries.cliente,
    });

    return res.status(200).send(getProcessList);
  };
}
