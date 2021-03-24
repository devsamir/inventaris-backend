import multer, { DiskStorageOptions, FileFilterCallback } from "multer";
import { Request, Response, NextFunction } from "express";
import { v4 } from "uuid";
import catchAsync from "../utils/catchAsync";
import { getManager } from "typeorm";
import Inventaris from "../models/Inventaris";
import formError from "../utils/formError";
import { validate } from "class-validator";
import Barang from "../models/Barang";
import AppError from "../utils/appError";
import Ruangan from "../models/Ruangan";
import RiwayatInventaris from "../models/RiwayatInventaris";
import AutoId from "../models/AutoId";
import { generate5Digit } from "../utils/helper";

const multerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads");
  },
  filename: (req, file, cb) => {
    const ext = file.originalname.split(".")[1];
    cb(null, `barang-${new Date().getTime()}-${v4()}.${ext}`);
  },
} as DiskStorageOptions);

const multerFilter = (req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
  cb(null, true);
};

const upload = multer({ storage: multerStorage, fileFilter: multerFilter });
export const uploadImageBarang = upload.single("image");

export const createInventaris = catchAsync(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const body = req.body;
    let path = null;
    if (req.file) path = req.file.path;
    const manager = getManager();
    const cekBarang = await manager.findOne(Barang, { where: { id: body.barang, active: true } });
    if (!cekBarang) return next(new AppError("Barang Dengan ID yang diberikan Tidak Ditemukan !", 400));
    const cekRuangan = await manager.findOne(Ruangan, { where: { id: body.ruangan, active: true } });
    if (!cekRuangan) return next(new AppError("Ruangan Dengan ID yang diberikan Tidak Ditemukan !", 400));
    const kodeInventaris = v4();
    const newInventaris = manager.create(Inventaris, {
      ...body,
      id: kodeInventaris,
      foto: path,
      tanggalKalibrasi: new Date(body.kalibrasiBarang),
      tanggalPembelian: new Date(body.tanggalPembelian),
      status: "Aktif",
    });
    const errors = await validate(newInventaris);
    if (errors.length > 0) return formError(errors, res);
    const newRiwayat = manager.create(RiwayatInventaris, {
      barang: kodeInventaris,
      ruangan: body.ruangan,
      keterangan: body.keterangan,
      status: "masuk",
      tanggal: new Date(body.tanggalPembelian),
    });
    const riwayatErrors = await validate(newRiwayat);
    if (riwayatErrors.length > 0) return formError(riwayatErrors, res);
    await manager.save(newInventaris);
    await manager.save(newRiwayat);
    res.status(201).json({ inventaris: newInventaris, riwayat: newRiwayat });
  }
);
export const getAllInventaris = catchAsync(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { page, limit, search, sort, barang, ruang }: any = req.query;
    const manager = getManager();
    let query =
      "select i.id,i.kodeInventaris,b.namaBarang,b.jenisBarang,i.merkBarang,i.typeBarang,i.serialNumber,i.tanggalPembelian,i.tanggalKalibrasi,i.namaVendor,r.namaRuangan,i.foto from inventaris i,ruangan r,barang b where i.barangId = b.id and i.ruanganId = r.id and i.active=true";
    let queryCount =
      "select count(i.id) as result from inventaris i,ruangan r,barang b where i.barangId = b.id and i.ruanganId = r.id and i.active=true";
    if (barang) {
      query += ` and i.barangId = ${barang}`;
      queryCount += ` and i.barangId = ${barang}`;
    }
    if (ruang) {
      query += ` and i.ruanganId = ${ruang}`;
      queryCount += ` and i.ruanganId = ${ruang}`;
    }
    if (search) {
      const fields = ["i.kodeInventaris,i.serialNumber"];
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
    const reqInventaris = manager.query(query);
    const reqCount = manager.query(queryCount);
    const [inventaris, [{ result }]] = await Promise.all([reqInventaris, reqCount]);
    res.status(200).json({ data: inventaris, result });
  }
);
export const generateKodeInventaris = catchAsync(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { ruang, tanggal, barang } = req.body;
    const manager = getManager();
    const ruangOne = await manager.findOne(Ruangan, { where: { id: ruang, active: true } });
    if (!ruangOne) return next(new AppError("Ruangan Tidak Ditemukan !", 400));
    const barangOne = await manager.findOne(Barang, { where: { id: barang, active: true } });
    if (!barangOne) return next(new AppError("Barang Tidak Ditemukan !", 400));
    const year = new Date(tanggal).getFullYear();
    let regenerate = true;
    let kodeBarang = "";
    let noInventaris = "";
    while (regenerate) {
      const id = await manager.findOne(AutoId, { where: { namaId: "noInventaris" } });
      if (!id) return next(new AppError("Auto ID Tidak Ditemukan, Hubungi Developer !", 400));
      const cekKode = await manager.findOne(Inventaris, { where: { nomorBarang: `${id.noId}` } });
      if (!cekKode) {
        kodeBarang = `${id.noId}`;
        noInventaris = `${generate5Digit(id.noId)}/${year}/${barangOne.kodeBarang}/${ruangOne.kodeRuangan}`;
        regenerate = false;
      } else {
        await manager.update(AutoId, { namaId: "noInventaris" }, { noId: id.noId + 1 });
      }
    }
    res.status(200).json({ kodeBarang, noInventaris });
  }
);
