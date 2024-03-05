import { Express } from "express";
import clientRoutes from "./clientRoutes";
import processRoutes from "./processRoutes";
import participantRoutes from "./participantRoutes";

export default function routes(app: Express) {
  clientRoutes(app);
  processRoutes(app);
  participantRoutes(app);
}
