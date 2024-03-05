import { Express } from "express";
import clientRoutes from "./clientRoutes";
import processRoutes from "./processRoutes";

export default function routes(app: Express) {
  clientRoutes(app);
  processRoutes(app);
}
