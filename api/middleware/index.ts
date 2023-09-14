import { Request, Response, NextFunction } from "express";
import jwt, { Secret } from "jsonwebtoken";

// Custom middleware for attaching user data to the request object
const attachUser = (req: Request, res: Response, next: NextFunction) => {
  const { authorization } = req.headers;

  // Check if the Authorization header contains a valid token
  if (authorization && authorization.startsWith("Bearer ")) {
    const token = authorization.split(" ")[1];

    try {
      const decoded = jwt.verify(token, process.env.SECRET_KEY as Secret); // Replace with your actual secret key

      // Attach the decoded user information to the request for use in your route handlers
      // req.user = decoded;
    } catch (error) {
      // Token verification failed, you can handle this error as needed
      console.error("Token verification failed:", error);
    }
  }

  next(); // Move on to the next middleware or route handler
};

export default attachUser;
