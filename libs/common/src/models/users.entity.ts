import { AbstractEntity } from "../database";
import { Column, Entity, JoinTable, ManyToMany } from "typeorm";
import { Role } from "./roles.entity";

@Entity()
export class User extends AbstractEntity<User> {
  @Column()
  email: string;

  @Column()
  password: string;

  @ManyToMany(() => Role, { cascade: true })
  @JoinTable()
  roles?: Role[]; // Remove `?` unless optional is intentional
}
