import { NextFunction, Request, Response } from "express";
import { number } from "joi";
import jwt from "jsonwebtoken";

const secretKey = "vWgsntqtrmctxGsEuaNLbwUIu21rceIK8OATlH1QRyaTpJegdb6qRwGfQx0eMfg70ZYduWEzaLvXqY5BOiui4Rp6PCk26ufMWkzX";

export function generateToken(user: Object): string {
  return jwt.sign({ user }, secretKey, { expiresIn: "24h" });
}

interface CustomRequest extends Request {
  user?: any;
}

export function authenticateToken(req: CustomRequest, res: Response, next: NextFunction): void | Response {
  const authHeader = req.headers['authorization'] as string | undefined;
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  jwt.verify(token, secretKey,  (err: any, user: any) => {
    if (err) {
      return res.status(403).json({ error: 'Invaild Token' });
    }
      req.body.user = user.user;
      next();
  });
}
