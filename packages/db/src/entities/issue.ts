import { Entity, PrimaryColumn, Column, BaseEntity } from "typeorm"

@Entity()
export class Issue extends BaseEntity {
  @PrimaryColumn({ type: 'varchar' })
  url!: string

  @Column({ type: 'jsonb' })
  links!: Array<[string, string]>
}
