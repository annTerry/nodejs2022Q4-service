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

  create(album: Album): DBResponse {
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
    this.db.setAlbum(newAlbum);
    response.code = 200;
    response.data = newAlbum;
    return response;
  }

  getAllAlbums(): Album[] {
    return this.db.allAlbums();
  }

  getAlbum(id: string): DBResponse {
    const response = new DBResponse();
    const valid = validate(id);
    if (!valid) {
      response.code = 400;
      response.message = `Id ${id} is not valid`;
      return response;
    }
    const album = this.db.getAlbum(id);
    if (!album) {
      response.code = 404;
      response.message = `Album with id ${id} not found`;
      return response;
    }
    response.data = album;
    response.code = 200;
    return response;
  }

  removeAlbum(id: string): DBResponse {
    const response = this.getAlbum(id);
    if (!response.data) return response;
    this.db.removeAlbum(id);
    return response;
  }

  changeAlbum(id: string, album: Album): DBResponse {
    const response = this.getAlbum(id);
    if (!response.data) {
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
    album.id = response.data.id;
    this.db.setAlbum(album);
    response.data = this.db.getAlbum(id);
    return response;
  }
}
