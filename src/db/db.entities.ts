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

  @OneToMany(() => Track, (track) => track.artistId, {
    onDelete: 'SET NULL',
  })
  track: Track[] | null;

  @OneToMany(() => Album, (album) => album.artistId, {
    onDelete: 'SET NULL',
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

  @ManyToOne(() => Artist, (artist) => artist.album, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  artistId: Artist | null;

  @OneToMany(() => Track, (track) => track.albumId, {
    onDelete: 'SET NULL',
  })
  track: Track[] | null;
}

@Entity()
export class Track {
  @PrimaryColumn()
  id: string;

  @Column()
  name: string;

  @ManyToOne(() => Artist, (artist) => artist.track, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  artistId: Artist | null;

  @ManyToOne(() => Album, (album) => album.track, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  albumId: Album | null;

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
