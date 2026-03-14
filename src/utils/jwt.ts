import jwt from "jsonwebtoken";
import mongoose from "mongoose";

const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET || process.env.JWT_SECRET || "LlaveSecretaPorSiAcaso";
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || "LlaveRefreshSecretaPorSiAcaso";
const ACCESS_EXPIRES_IN = (process.env.JWT_ACCESS_EXPIRES_IN || "15m") as jwt.SignOptions["expiresIn"];
const REFRESH_EXPIRES_IN = (process.env.JWT_REFRESH_EXPIRES_IN || "7d") as jwt.SignOptions["expiresIn"];

export interface JwtPayload {
    sub: string;
    name: string;
    email: string;
    organizacion: string;
}

export const generateAccessToken = (userId: string, name: string, email: string, organizacion: mongoose.Types.ObjectId | string) => {
    return jwt.sign(
        { sub: userId, name, email, organizacion: String(organizacion) },
        ACCESS_SECRET,
        { expiresIn: ACCESS_EXPIRES_IN }
    );
};

export const generateRefreshToken = (userId: string, name: string, email: string, organizacion: mongoose.Types.ObjectId | string) => {
    return jwt.sign(
        { sub: userId, name, email, organizacion: String(organizacion) },
        REFRESH_SECRET,
        { expiresIn: REFRESH_EXPIRES_IN }
    );
};

export const verifyAccessToken = (token: string) => {
    return jwt.verify(token, ACCESS_SECRET) as JwtPayload;
};

export const verifyRefreshToken = (token: string) => {
    return jwt.verify(token, REFRESH_SECRET) as JwtPayload;
};