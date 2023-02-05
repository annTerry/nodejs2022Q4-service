import { Injectable } from '@nestjs/common';
import { v4 as newUUID, validate } from 'uuid';
import {
  stringAndExist,
  stringOrNotExist,
  numberAndExist,
} from '../common/utility';
import { DataBase } from 'src/db/db.service';
import { Album, Response } from '../common/types';

@Injectable()
export class AlbumService {
  db = new DataBase();

  create(album: Album): number {
    const validate =
      stringAndExist(album.name) &&
      numberAndExist(album.year) &&
      stringOrNotExist(album.artistId);
    if (!validate) return 400;
    const newAlbum = new Album();
    newAlbum.name = album.name;
    newAlbum.year = album.year;
    newAlbum.artistId = album.artistId;
    newAlbum.id = newUUID();
    this.db.setAlbum(newAlbum);
    return 200;
  }

  getAllAlbums(): Album[] {
    return this.db.allAlbums();
  }

  getAlbum(id: string): Response {
    const response = new Response();
    const valid = validate(id);
    if (!valid) {
      response.code = 400;
      response.message = `Id ${id} is not valid`;
      return response;
    }
    const Album = this.db.getAlbum(id);
    if (!Album) {
      response.code = 404;
      response.message = `Album with id ${id} not found`;
      return response;
    }
    response.code = 200;
    return response;
  }

  removeAlbum(id: string): Response {
    const response = this.getAlbum(id);
    if (!response.data) return response;
    this.db.removeAlbum(id);
    return response;
  }

  changeAlbum(id: string, album: Album): Response {
    const response = this.getAlbum(id);
    if (!response.data) {
      response.code = 404;
      response.message = `Album with id ${id} not found`;
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
    return response;
  }
}
