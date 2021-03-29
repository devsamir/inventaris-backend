import { IsDate, IsDefined } from "class-validator";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import Inventaris from "./Inventaris";
import Ruangan from "./Ruangan";

@Entity({ name: "riwayat_inventaris" })
export default class RiwayatInventaris {
  @PrimaryGeneratedColumn("increment")
  id: number;
  @IsDefined({ message: "Barang Tidak Boleh Kosong !" })
  @ManyToOne(() => Inventaris, (Inventaris) => Inventaris.id, { nullable: false })
  barang: string;

  @Column()
  barangId: string;
  @Column("date")
  @IsDefined({ message: "Tanggal Tidak Boleh Kosong !" })
  @IsDate({ message: "Format Tanggal Salah !" })
  tanggal: Date;
  @ManyToOne(() => Ruangan, (Ruangan) => Ruangan.id, { nullable: false })
  @IsDefined({ message: "Ruangan Tidak Boleh Kosong !" })
  ruangan: string;
  @Column("enum", { enum: ["masuk", "pindah", "keluar", "kalibrasi"] })
  @IsDefined({ message: "Status Transaksi Tidak Boleh Kosong" })
  status: "masuk" | "pindah" | "keluar" | "kalibrasi";
  @Column("text", { nullable: true })
  keterangan: string;
  @Column({ default: 0, type: "double" })
  biayaTransaksi: number;
}
