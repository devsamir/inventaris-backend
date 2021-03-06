import { IsDefined, MinLength } from "class-validator";
import { Column, Entity, PrimaryColumn, Unique } from "typeorm";

@Entity()
@Unique("Nama Ruangan", ["namaRuangan", "active"])
export default class Ruangan {
  @PrimaryColumn()
  id: string;
  @Column()
  @IsDefined({ message: "Nama Ruangan Tidak Boleh Kosong !" })
  @MinLength(1, { message: "Nama Ruangan Tidak Boleh Kosong !" })
  namaRuangan: string;
  @Column()
  @IsDefined({ message: "Kode Ruangan Tidak Boleh Kosong !" })
  @MinLength(1, { message: "Kode Ruangan Tidak Boleh Kosong !" })
  kodeRuangan: string;
  @Column("boolean", { default: true, select: false })
  active: boolean;
}
