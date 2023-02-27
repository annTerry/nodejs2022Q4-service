import { Injectable } from '@nestjs/common';
import { v4 as newUUID, validate } from 'uuid';
import { stringAndExist, booleanAndExist } from '../common/utility';
import { DataBase } from 'src/db/db.service';
import { Artist, DBResponse } from '../common/types';

@Injectable()
export class ArtistService {
  constructor(private db: DataBase) {}

  async create(artist: Artist): Promise<DBResponse> {
    const response = new DBResponse();
    const validate =
      stringAndExist(artist.name) && booleanAndExist(artist.grammy);
    if (!validate) {
      response.code = 400;
      return response;
    }
    const newArtist = new Artist();
    newArtist.name = artist.name;
    newArtist.grammy = artist.grammy;
    newArtist.id = newUUID();
    await this.db.setArtist(newArtist);
    response.code = 200;
    response.data = newArtist;
    return response;
  }

  async getAllArtists(): Promise<Artist[]> {
    return await this.db.allArtists();
  }

  async getArtist(id: string): Promise<DBResponse> {
    const response = new DBResponse();
    const valid = validate(id);
    if (!valid) {
      response.code = 400;
      response.message = `Id ${id} is not valid`;
      return response;
    }
    const artist = await this.db.getArtist(id);
    if (!artist || !artist.id) {
      response.code = 404;
      response.message = `Artist with id ${id} not found`;
      return response;
    }
    response.data = artist;
    response.code = 200;
    return response;
  }

  async removeArtist(id: string): Promise<DBResponse> {
    const response = await this.getArtist(id);
    const dataRes = response.data as Artist;
    if (!dataRes || !dataRes.id) return response;
    await this.db.removeArtist(id);
    return response;
  }

  async changeArtist(id: string, artist: Artist): Promise<DBResponse> {
    let response = new DBResponse();
    const validate =
      stringAndExist(artist.name) && booleanAndExist(artist.grammy);
    if (!validate) {
      response.code = 400;
      response.message = `Wrong data`;
      return response;
    }
    response = await this.getArtist(id);
    const dataRes = response.data as Artist;
    if (!dataRes || !dataRes.id) {
      return response;
    }
    artist.id = dataRes.id;
    await this.db.setArtist(artist);
    response.data = await this.db.getArtist(artist.id);
    return response;
  }
}
