import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { User, Track, Album, Artist, Favorites } from './db.entities';
import {
  POSTGRES_PORT,
  POSTGRES_PASSWORD,
  POSTGRES_USER,
  POSTGRES_DB,
} from '../common/const';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: 'postgres',
  port: POSTGRES_PORT as number,
  username: POSTGRES_USER,
  password: POSTGRES_PASSWORD,
  database: POSTGRES_DB,
  synchronize: true,
  //logging: true,
  entities: [User, Track, Album, Artist, Favorites],
  subscribers: [],
  migrations: [],
});
