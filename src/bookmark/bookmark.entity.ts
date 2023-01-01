import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class BookmarkEntity {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column()
  link: string;
}
