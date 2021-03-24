import { Request, Response, NextFunction } from "express";
import { getManager } from "typeorm";
import { validate } from "class-validator";
import { v4 } from "uuid";

import catchAsync from "../utils/catchAsync";
import Ruangan from "../models/Ruangan";
import AppError from "../utils/appError";
import formError from "../utils/formError";

const getAllRuangan = catchAsync(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const manager = getManager();
    const user = await manager.find(Ruangan, { where: { active: true }, order: { namaRuangan: "ASC" } });
    res.status(200).json(user);
  }
);
const createRuangan = catchAsync(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const body = req.body;
    const manager = getManager();
    const newRuangan = manager.create(Ruangan, { id: v4(), ...body });
    const errors = await validate(newRuangan);
    if (errors.length > 0) return formError(errors, res);
    await manager.save(newRuangan);
    res.status(201).json(newRuangan);
  }
);
const getOneRuangan = catchAsync(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { id } = req.params;
    const manager = getManager();
    const ruangan = await manager.findOne(Ruangan, { where: { id, active: true } });
    if (!ruangan) return next(new AppError("Ruangan Tidak Ditemukan", 400));
    res.status(200).json(ruangan);
  }
);
const updateRuangan = catchAsync(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { id } = req.params;
    const body = req.body;
    const manager = getManager();
    const ruangan = await manager.findOne(Ruangan, { where: { id, active: true } });
    if (!ruangan) return next(new AppError("Ruangan Tidak Ditemukan", 400));
    const updatedRuangan = await manager.create(Ruangan, { id, ...body });
    const errors = await validate(updatedRuangan);
    if (errors.length > 0) return formError(errors, res);
    await manager.save(updatedRuangan);
    res.status(200).json(updatedRuangan);
  }
);
const deleteRuangan = catchAsync(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { id } = req.params;
    const manager = getManager();
    const ruangan = await manager.findOne(Ruangan, { where: { id, active: true } });
    if (!ruangan) return next(new AppError("Ruangan Tidak Ditemukan", 400));
    await manager.update(Ruangan, { id }, { active: false });
    res.status(204).json(null);
  }
);
export { getAllRuangan, createRuangan, getOneRuangan, deleteRuangan, updateRuangan };
