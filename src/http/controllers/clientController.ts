import ClientModel from "../models/postgres/clientModel";
import AuthClientService from "../services/client/authClientService";
import RegisterClientService from "../services/client/registerClientService";
import { Request, Response } from "express";
import JwtService from "../services/jwt/jwtService";

export default class ClientController {
  private clientModel = new ClientModel();
  private jwtService = new JwtService();

  public constructor() {}

  public registerClient = async (req: Request, res: Response) => {
    const dto = req.body;

    const registerClientService = new RegisterClientService(this.clientModel);

    await registerClientService.exec(dto);

    return res.status(201).send({ message: "Cliente registrado com sucesso." });
  };

  public authClient = async (req: Request, res: Response) => {
    const dto = req.body;

    const authClientService = new AuthClientService(this.clientModel);

    const client = await authClientService.exec(dto);

    const token = this.jwtService.sign(client.id);

    return res.status(201).send({ authToken: token });
  };
}
