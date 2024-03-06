import { Express } from "express";
import clientRoutes from "./clientRoutes";
import processRoutes from "./processRoutes";
import participantRoutes from "./participantRoutes";
import participantProcessRoutes from "./participantProcessRoutes";

export default function routes(app: Express) {
  clientRoutes(app);
  processRoutes(app);
  participantRoutes(app);
  participantProcessRoutes(app);
}
