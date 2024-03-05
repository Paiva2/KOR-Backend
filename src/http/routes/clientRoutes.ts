import { Express } from "express";
import { dtoHandler } from "../middlewares/DtoHandler";
import { clientAuthDTO, clientRegisterDTO } from "../dtos/clientDtos";
import ClientController from "../controllers/clientController";

export default function clientRoutes(app: Express) {
  const clientController = new ClientController();

  app.post(
    "/cliente/registro",
    [dtoHandler(clientRegisterDTO)],
    clientController.registerClient
  );

  app.post(
    "/cliente/login",
    [dtoHandler(clientAuthDTO)],
    clientController.authClient
  );
}
