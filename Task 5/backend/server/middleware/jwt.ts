import { Request, Response, NextFunction } from "express";
import { sign , verify } from "jsonwebtoken";


interface User {
  id: number;
  username: string;
  isAdmin: boolean;
}

declare global {
  namespace Express {
    interface Request {
      user?: User; // Define the user property on Request
    }
  }
}


export const verifyToken = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const accessToken = req.cookies["access-token"];

  if (!accessToken) {
    res.status(401).json({ error: "Access token not provided" });
    return ;
  }

  try {
    const decoded = verify(accessToken, "secretKey") as User;
    req.user = decoded; // Attach decoded user information to the request object
    next();
  } catch (err) {
    console.error("Error verifying token:", err);
    res.status(403).json({ error: "Invalid token" });
  }
};

export const createTokens = (user: User): string => {
  const accessToken = sign(
    { username: user.username, id: user.id ,isAdmin: user.isAdmin},
    "seceretKey"
  );
  return accessToken;
};