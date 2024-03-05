import { Request, Response } from "express";
import ProcessFactory from "./factories/processFactory";

export default class ProcessController {
  public constructor() {}

  public newProcess = async (req: Request, res: Response) => {
    const dto = req.body;

    const factory = new ProcessFactory();

    const { createNewProcessService } = await factory.exec();

    const newProcess = await createNewProcessService.exec(
      "56415bc9-7b04-4d26-b534-82fab4507937",
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
}
