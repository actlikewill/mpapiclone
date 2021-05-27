import { RequestHandler } from "express";
import { NotFound } from "../errors/not-found-error";

export const notFoundHandler: RequestHandler = ( req, res, next ) => {

    throw new NotFound()

}