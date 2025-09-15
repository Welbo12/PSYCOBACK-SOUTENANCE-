import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/jswtUtils";


export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ success: false, message: "Token manquant ou invalide" });
  }

  const token = authHeader.split(" ")[1];
  const decoded = verifyToken(token);

  if (!decoded) {
    return res
      .status(401)
      .json({ success: false, message: "Token invalide ou expiré" });
  }

  (req as any).user = decoded;
  next();
};
