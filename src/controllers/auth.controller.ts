import { Request, Response, NextFunction } from "express";
import { getManager } from "typeorm";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

import catchAsync from "../utils/catchAsync";
import User from "../models/User";
import AppError from "../utils/appError";

dotenv.config();
const login = catchAsync(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { username, password } = req.body;
    const manager = getManager();
    const user = await manager.findOne(User, { where: { username, active: true } });
    if (!user) return next(new AppError("Username atau Password Salah !", 400));
    const cekPass = await bcrypt.compare(password, user.password);
    if (!cekPass) return next(new AppError("Username atau Password Salah !", 400));
    const jwtSecret: any = process.env.JWT_SECRET;
    const token = await jwt.sign({ id: user.id }, jwtSecret, { expiresIn: "1d" });
    res.cookie("jwt", token, { httpOnly: true });

    res.status(200).json({ user: { username, role: user.role, id: user.id }, isLogin: true });
  }
);
const cekJwt = catchAsync(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const manager = getManager();
    const jwtSecret: any = process.env.JWT_SECRET;
    if (!req.cookies.jwt) return next(new AppError("Anda Belum Login", 401));
    const token: any = await jwt.verify(req.cookies.jwt, jwtSecret);
    const user = await manager.findOne(User, { where: { id: token.id, active: true } });
    if (!user) {
      res.clearCookie("jwt");
      return next(new AppError("Anda Belum Login", 401));
    }
    res.status(200).json({ isLogin: true, user: { username: user.username, role: user.role, id: user.id } });
  }
);
const protect = catchAsync(
  async (req: Request | any, res: Response, next: NextFunction): Promise<void> => {
    const manager = getManager();
    const jwtSecret: any = process.env.JWT_SECRET;
    if (!req.cookies.jwt) return next(new AppError("Anda Belum Login", 401));
    const token: any = await jwt.verify(req.cookies.jwt, jwtSecret);
    const user: any = await manager.findOne(User, { where: { id: token.id, active: true } });
    if (!user) {
      res.clearCookie("jwt");
      return next(new AppError("Anda Belum Login", 401));
    }
    user.active = undefined;
    user.password = undefined;
    req.user = user;
    next();
  }
);
const logout = catchAsync(
  async (req: Request | any, res: Response, next: NextFunction): Promise<void> => {
    res.clearCookie("jwt");
    res.status(200).json({ isLogin: false });
  }
);
// const restrictTo = (...roles: string[]) => {
//   return async (req: Request | any, res: Response, next: NextFunction): Promise<void> => {
//     if (roles.includes(req.user.role)) {
//       console.log(roles, req.user.role);

//       next();
//     } else {
//       next(new AppError("Anda Tidak Berhak Melakukan Operasi Ini", 400));
//     }
//   };
// };
export { login, cekJwt, protect, logout };
