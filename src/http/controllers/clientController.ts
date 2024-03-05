import ClientModel from "../models/postgres/clientModel";
import RegisterClientService from "../services/client/registerClientService";
import { Request, Response } from "express";

export default class ClientController {
  private clientModel = new ClientModel();

  public constructor() {}

  public registerClient = async (req: Request, res: Response) => {
    const dto = req.body;

    const registerClientService = new RegisterClientService(this.clientModel);

    await registerClientService.exec(dto);

    return res.status(201).send({ message: "Cliente registrado com sucesso." });
  };
}
