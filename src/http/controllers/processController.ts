import { Request, Response } from "express";
import ProcessFactory from "./factories/processFactory";
import JwtService from "../services/jwt/jwtService";

export default class ProcessController {
  private factory = new ProcessFactory();
  private jwtService = new JwtService();

  public constructor() {}

  public newProcess = async (req: Request, res: Response) => {
    const dto = req.body;

    const { createNewProcessService } = await this.factory.exec();

    const parseToken = this.jwtService.decode(
      req.headers.authorization!.replace("Bearer ", "")
    );

    const newProcess = await createNewProcessService.exec(parseToken!, dto);

    return res.status(201).send({
      message: "Processo criado com sucesso.",
      processo: {
        id: newProcess.id,
        number: newProcess.number,
      },
    });
  };
}
