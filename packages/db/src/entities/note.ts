import { Column, Entity, PrimaryGeneratedColumn, BaseEntity } from "typeorm"

@Entity()
export class Note extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: string;
  
  @Column({ type: 'varchar' })
  url!: string

  @Column({ type: 'varchar' })
  note_en!: string

  @Column({ type: 'varchar', nullable: true })
  note_uk?: string | null

  @Column({ type: 'boolean' })
  uk_approved: boolean = false

  @Column({ type: 'boolean' })
  visible: boolean = true
}
