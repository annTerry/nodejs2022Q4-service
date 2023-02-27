import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { CreateTable1676913706854 } from '../migrations/CreateTable';
import { User, Track, Album, Artist, Favorites } from './db.entities';
import {
  POSTGRES_PORT,
  POSTGRES_PASSWORD,
  POSTGRES_USER,
  POSTGRES_DB,
  RUN_MIGRATION,
} from '../common/const';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: 'postgres',
  port: POSTGRES_PORT as number,
  username: POSTGRES_USER,
  password: POSTGRES_PASSWORD,
  database: POSTGRES_DB,
  synchronize: false,
  logging: false,
  entities: [User, Track, Album, Artist, Favorites],
  migrations: [CreateTable1676913706854],
  migrationsRun: RUN_MIGRATION,
});
