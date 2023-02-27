import { Injectable } from '@nestjs/common';
import { v4 as newUUID, validate } from 'uuid';
import {
  stringAndExist,
  stringOrNotExist,
  numberAndExist,
} from '../common/utility';
import { DataBase } from 'src/db/db.service';
import { Album, DBResponse } from '../common/types';

@Injectable()
export class AlbumService {
  constructor(private db: DataBase) {}

  async create(album: Album): Promise<DBResponse> {
    const response = new DBResponse();
    const validate =
      stringAndExist(album.name) &&
      numberAndExist(album.year) &&
      stringOrNotExist(album.artistId);
    if (!validate) {
      response.code = 400;
      return response;
    }
    const newAlbum = new Album();
    newAlbum.name = album.name;
    newAlbum.year = album.year;
    newAlbum.artistId = album.artistId;
    newAlbum.id = newUUID();
    await this.db.setAlbum(newAlbum);
    response.code = 200;
    response.data = newAlbum;
    return response;
  }

  async getAllAlbums(): Promise<Album[]> {
    return await this.db.allAlbums();
  }

  async getAlbum(id: string): Promise<DBResponse> {
    const response = new DBResponse();
    const valid = validate(id);
    if (!valid) {
      response.code = 400;
      response.message = `Id ${id} is not valid`;
      return response;
    }
    const album = await this.db.getAlbum(id);
    if (!album || !album.id) {
      response.code = 404;
      response.message = `Album with id ${id} not found`;
      return response;
    }
    response.data = album;
    response.code = 200;
    return response;
  }

  async removeAlbum(id: string): Promise<DBResponse> {
    const response = await this.getAlbum(id);
    const data = response.data as Album;
    if (!data || !data.id) return response;
    await this.db.removeAlbum(id);
    return response;
  }

  async changeAlbum(id: string, album: Album): Promise<DBResponse> {
    const response = await this.getAlbum(id);
    const data = response.data as Album;
    if (!data || !data.id) {
      return response;
    }
    const validate =
      stringAndExist(album.name) &&
      numberAndExist(album.year) &&
      stringOrNotExist(album.artistId);
    if (!validate) {
      response.code = 400;
      response.message = `Wrong data`;
      return response;
    }
    const dataRes = response.data as Album;
    album.id = dataRes.id;
    await this.db.setAlbum(album);
    response.data = await this.db.getAlbum(id);
    return response;
  }
}
