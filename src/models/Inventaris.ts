import { Column, Entity, ManyToOne, PrimaryColumn, Unique } from "typeorm";
import { IsDate, IsDefined, MinLength } from "class-validator";
import Barang from "./Barang";
import Ruangan from "./Ruangan";

@Entity({ name: "inventaris" })
@Unique("Nomor Barang", ["nomorBarang", "active"])
@Unique("Kode Inventaris", ["kodeInventaris", "active"])
export default class Inventaris {
  @PrimaryColumn()
  id: string;
  @ManyToOne(() => Barang, (Barang) => Barang.id, { nullable: false })
  @IsDefined({ message: "Barang Tidak Boleh Kosong !" })
  barang: string;
  @Column()
  @IsDefined({ message: "Kode Inventaris Tidak Boleh Kosong !" })
  @MinLength(1, { message: "Kode Inventaris Tidak Boleh Kosong !" })
  kodeInventaris: string;
  @Column()
  @IsDefined({ message: "Merk Barang Tidak Boleh Kosong !" })
  @MinLength(1, { message: "Merk Barang Tidak Boleh Kosong !" })
  merkBarang: string;
  @Column()
  @IsDefined({ message: "Type Barang Tidak Boleh Kosong !" })
  @MinLength(1, { message: "Type Barang Tidak Boleh Kosong !" })
  typeBarang: string;
  @Column()
  @IsDefined({ message: "Serial Number Tidak Boleh Kosong !" })
  @MinLength(1, { message: "Serial Number Tidak Boleh Kosong !" })
  serialNumber: string;
  @Column("date")
  @IsDefined({ message: "Tanggal Barang Mulai Dipakai Harus Diisi !" })
  @IsDate({ message: "Format Tanggal Salah !" })
  tanggalPembelian: Date;
  @Column("date")
  @IsDefined({ message: "Tanggal Kalibrasi Barang Harus Diisi !" })
  @IsDate({ message: "Format Tanggal Salah !" })
  tanggalKalibrasi: Date;
  @ManyToOne(() => Ruangan, (Ruangan) => Ruangan.id, { nullable: false })
  @IsDefined({ message: "Ruangan Tidak Boleh Kosong !" })
  ruangan: string;
  @Column({ nullable: true })
  namaVendor: string;
  @Column({ nullable: true })
  teleponVendor: string;
  @Column({ nullable: true })
  foto: string;
  @Column("enum", {
    enum: ["Aktif", "Tidak Aktif"],
  })
  status: "Aktif" | "Tidak Aktif";
  @Column()
  @IsDefined({ message: "Nomor Barang Tidak Boleh Kosong !" })
  nomorBarang: string;
  @Column({ default: true })
  active: boolean;
}
