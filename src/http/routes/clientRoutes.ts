import { Express } from "express";
import ClientController from "../controllers/clientController";

export default function clientRoutes(app: Express) {
  const clientController = new ClientController();

  app.post("/register", clientController.registerClient);
}
