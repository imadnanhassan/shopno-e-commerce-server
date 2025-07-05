interface JwtPayload {
  id: string;
  role: string;
}
declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

export { JwtPayload };
