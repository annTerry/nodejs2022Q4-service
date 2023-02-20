import * as dotenv from 'dotenv';

dotenv.config();

export const CLEAN_DB = process.env.CLEAN_DB === 'true' || false;
export const PORT = process.env.PORT || 4000;
export const POSTGRES_PORT = process.env.POSTGRES_PORT || 5432;
export const POSTGRES_USER = process.env.POSTGRES_USER || 'admin';
export const POSTGRES_PASSWORD = process.env.POSTGRES_PASSWORD || 'pwd';
export const POSTGRES_DB = process.env.POSTGRES_DB || 'postgres';
export const DB_URL = process.env.DB_URL || 'postgres';

export const FAVORITE_TYPES = {
  track: 'track',
  artist: 'artist',
  album: 'album',
};
