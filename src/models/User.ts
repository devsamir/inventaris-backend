import { IsDefined, MinLength } from "class-validator";
import { Column, Entity, PrimaryColumn, Unique } from "typeorm";

@Entity()
@Unique("Nama", ["name", "role", "active"])
export default class User {
  @PrimaryColumn()
  id: string;
  @Column()
  @IsDefined({ message: "Username Tidak Boleh Kosong !" })
  @MinLength(1, { message: "Username Tidak Boleh Kosong !" })
  username: string;
  @Column()
  @IsDefined({ message: "Password Tidak Boleh Kosong !" })
  @MinLength(1, { message: "Password Tidak Boleh Kosong !" })
  password: string;
  @Column("enum", {
    enum: [
      "ruangan",
      //   "timPengadaanMedis",
      //   "timPengadaanNonMedis",
      //   "timPenerimaMedis",
      //   "timPenerimaNonMedis",
      //   "managerKeuangan",
      //   "managerPelayanan",
      "admin",
      "inventaris",
    ],
  })
  @IsDefined({ message: "Role Tidak Boleh Kosong !" })
  role: "ruangan" | "admin" | "inventaris";
  @Column("boolean", { default: true, select: false })
  active: boolean;
}
