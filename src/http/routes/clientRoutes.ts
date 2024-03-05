import { Express } from "express";
import ClientController from "../controllers/clientController";
import { dtoHandler } from "../middlewares/DtoHandler";
import { clientRegisterDTO } from "../dtos/clientDtos";

export default function clientRoutes(app: Express) {
  const clientController = new ClientController();

  app.post(
    "/register",
    [dtoHandler(clientRegisterDTO)],
    clientController.registerClient
  );
}
