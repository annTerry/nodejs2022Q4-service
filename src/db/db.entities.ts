import { Entity, Column, PrimaryColumn, OneToMany, ManyToOne } from 'typeorm';

@Entity()
export class User {
  @PrimaryColumn()
  id: string;

  @Column()
  login: string;

  @Column()
  password: string;

  @Column()
  version: number;

  @Column({ type: 'bigint' })
  createdAt: number;

  @Column({ type: 'bigint' })
  updatedAt: number;
}

@Entity()
export class Artist {
  @PrimaryColumn()
  id: string;

  @Column()
  name: string;

  @Column()
  grammy: boolean;

  @OneToMany(() => Track, (track) => track.id, {
    onDelete: 'CASCADE',
  })
  track: Track[] | null;

  @OneToMany(() => Album, (album) => album.id, {
    onDelete: 'CASCADE',
  })
  album: Album[] | null;
}

@Entity()
export class Album {
  @PrimaryColumn()
  id: string;

  @Column()
  name: string;

  @Column()
  year: number;

  @ManyToOne(() => Artist, (artist) => artist.id, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  artistId: Artist | null;

  @OneToMany(() => Track, (track) => track.id, {
    onDelete: 'CASCADE',
  })
  track: Track[];
}

@Entity()
export class Track {
  @PrimaryColumn()
  id: string;

  @Column()
  name: string;

  @ManyToOne(() => Artist, (artist) => artist.id, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  artistId: Artist | null;

  @ManyToOne(() => Album, (album) => album.id, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  albumId: Artist | null;

  @Column()
  duration: number;
}

@Entity()
export class Favorites {
  @PrimaryColumn()
  id: string;

  @Column()
  type: string;
}
