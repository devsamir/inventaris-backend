import { Request, Response, NextFunction } from "express";
import { getManager } from "typeorm";
import { v4 } from "uuid";
import { validate } from "class-validator";
import formError from "../utils/formError";
import Barang from "../models/Barang";
import catchAsync from "../utils/catchAsync";
import AppError from "../utils/appError";

export const getAllBarang = catchAsync(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { page, limit, search, sort }: any = req.query;
    const manager = getManager();
    let query = "";
    let queryCount = "";
    if (search) {
      const fields = ["namaBarang,kodeBarang,keterangan"];
      const searchQuery = fields.map((item) => `${item} like '%${search}%'`).join(" or ");
      query += ` and (${searchQuery})`;
      queryCount += ` and (${searchQuery})`;
    }
    if (sort) {
      query += ` order by ${sort.split("_")[0]} ${sort.split("_")[1]} `;
    }
    if (page && limit) {
      const take = page * limit;
      const skip = (page - 1) * limit;
      query += ` limit ${take} offset ${skip}`;
    }
    const barang = await manager.query(`select * from barang where active=true ${query}`);
    const count = await manager.query(`select count(*) as result from barang where active=true ${queryCount}`);
    barang.forEach((item: any) => {
      item.active = undefined;

      if (item.jenisBarang === "medis") item.jenisBarang = "Barang Medis";
      if (item.jenisBarang === "nonMedis") item.jenisBarang = "Barang Non Medis";
      if (item.keterangan.split(" ").length > 5) {
        item.keterangan = item.keterangan.split(" ").slice(0, 5).join(" ");
      }
    });
    res.status(200).json({ data: barang, result: count[0].result });
  }
);
export const createBarang = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const body = req.body;
  const manager = getManager();
  const newBarang = manager.create(Barang, { id: v4(), ...body });
  const errors = await validate(newBarang);
  if (errors.length > 0) return formError(errors, res);
  await manager.save(newBarang);
  res.status(200).json(newBarang);
});
export const updateBarang = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const body = req.body;
  const manager = getManager();
  const cekBarang = await manager.findOne(Barang, { where: { id } });
  if (!cekBarang) return next(new AppError("Barang Dengan ID yang diberikan Tidak Ditemukan !", 400));
  const updatedBarang = manager.create(Barang, { id, ...body });
  const errors = await validate(updatedBarang);
  if (errors.length > 0) return formError(errors, res);
  await manager.save(updatedBarang);
  res.status(200).json(updatedBarang);
});
export const deleteBarang = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { barang } = req.body;
  const manager = getManager();
  await Promise.all(
    barang.map(async (id: string) => {
      await manager.update(Barang, { id }, { active: false });
      return true;
    })
  );
  res.status(204).json(null);
});
