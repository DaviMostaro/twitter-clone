import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { findUserBySlug } from "../services/user";
import { ExtendedRequest } from "../types/extended-request";

export const createJWT = (slug: string) => {
    return jwt.sign({ slug }, process.env.JWT_SECRET as string);
};

export const verifyJWT = (req: ExtendedRequest, res: Response, next: NextFunction): any => {
    const authHeader = req.headers['authorization'];
    if(!authHeader) {
        return res.status(401).json({ error: "Acesso não autorizado" });
    }

    const token = authHeader.split(' ')[1];

    jwt.verify(
        token,
        process.env.JWT_SECRET as string,
        async (error, decoded: any) => {
            if(error) {
                return res.status(401).json({ error: "Acesso não autorizado" });
            }

            const user = await findUserBySlug(decoded.slug);
            if(!user) {
                return res.status(401).json({ error: "Acesso não autorizado" });
            }

            req.userSlug = user.slug;

            next();
        }
    );
}