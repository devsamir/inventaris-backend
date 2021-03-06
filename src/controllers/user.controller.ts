import { Request, Response, NextFunction } from "express";
import { getManager } from "typeorm";
import { validate } from "class-validator";
import { v4 } from "uuid";
import bcrypt from "bcryptjs";

import catchAsync from "../utils/catchAsync";
import User from "../models/User";
import AppError from "../utils/appError";
import formError from "../utils/formError";

const getAllUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const manager = getManager();
    const user = await manager.find(User, { select: ["id", "username", "role"], where: { active: true } });
    res.status(200).json(user);
  }
);
const createUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { username, password, role } = req.body;
    const manager = getManager();
    if (role === "managerKeuangan" || role === "managerPelayanan") {
      const [, count] = await manager.findAndCount(User, { where: { role, active: true } });
      if (count > 0) return next(new AppError(`User dengan role ${role} sudah ada`, 400));
    }
    const newPassword = await bcrypt.hash(password, 10);
    const newUser = manager.create(User, { id: v4(), role, username, password: newPassword });
    const errors = await validate(newUser);
    if (errors.length > 0) return formError(errors, res);
    await manager.save(newUser);
    res.status(201).json(newUser);
  }
);
const getOneUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { id } = req.params;
    const manager = getManager();
    const user = await manager.findOne(User, { select: ["id", "username", "role"], where: { id, active: true } });
    if (!user) return next(new AppError("User Tidak Ditemukan", 400));
    res.status(200).json(user);
  }
);
const deleteUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { id } = req.params;
    const manager = getManager();
    const user = await manager.findOne(User, { where: { id, active: true } });
    if (!user) return next(new AppError("User Tidak Ditemukan", 400));
    if (user.role === "admin") {
      const countAdmin = await manager.count(User, { where: { role: "admin", active: true } });
      if (countAdmin < 2) return next(new AppError("Gagal Hapus Admin, Harus Selalu Ada Satu Admin Atau Lebih !", 400));
    }
    await manager.update(User, { id }, { active: false });
    res.status(204).json(null);
  }
);
export { getAllUser, createUser, getOneUser, deleteUser };
