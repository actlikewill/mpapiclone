import { UserDocument } from "../src/models";


declare global {
  namespace Express {
    interface Request {
      currentUser?: UserDocument;
    }
  }
}