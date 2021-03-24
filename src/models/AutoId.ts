import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity({ name: "auto_id" })
export default class AutoId {
  @PrimaryColumn()
  namaId: string;
  @Column()
  noId: number;
}
