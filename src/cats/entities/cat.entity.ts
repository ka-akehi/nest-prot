import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'cats' })
export class CatEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 255 })
  name: string;

  @Column('integer')
  age: number;

  @Column({ length: 255 })
  breed: string;
}
