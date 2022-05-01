import { Request, Response, NextFunction } from 'express';
import { DecodedIdToken } from 'firebase-admin/lib/auth/token-verifier';
import { auth } from '../config';
import { NotAuthorizedError } from '../errors';

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      currentUser?: DecodedIdToken;
    }
  }
}

export const decodeToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token: string = req.headers.authorization?.split(' ')[1] ?? '';
  try {
    if (token === 'guest') {
      req.currentUser = undefined;
      return next();
    }
    const decodeValue = await auth.verifyIdToken(token);
    if (decodeValue) {
      req.currentUser = decodeValue;
      return next();
    }
    throw new NotAuthorizedError();
  } catch (error) {
    console.log(error);
    next(new NotAuthorizedError());
  }
};
