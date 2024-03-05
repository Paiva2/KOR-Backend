import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import "dotenv/config";
import ForbiddenException from "../exceptions/forbiddenException";

export default function tokenHandler(
  req: Request,
  _: Response,
  next: NextFunction
) {
  const token = req.headers.authorization;

  if (!token) {
    throw new ForbiddenException("Token de autorização não encontrado.");
  }

  try {
    jwt.verify(token.replace("Bearer ", ""), process.env.JWT_SECRET!, {
      issuer: process.env.JWT_ISSUER,
    });

    next();
  } catch (e) {
    console.error(e);

    if (e instanceof Error) {
      throw new ForbiddenException(e.message);
    }
  }
}
