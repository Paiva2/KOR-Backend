import { Express } from "express";
import clientRoutes from "./clientRoutes";

export default function routes(app: Express) {
  clientRoutes(app);
}
