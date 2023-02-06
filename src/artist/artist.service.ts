import { Injectable } from '@nestjs/common';
import { v4 as newUUID, validate } from 'uuid';
import { stringAndExist, booleanAndExist } from '../common/utility';
import { DataBase } from 'src/db/db.service';
import { Artist, DBResponse } from '../common/types';

@Injectable()
export class ArtistService {
  constructor(private db: DataBase) {}

  create(artist: Artist): DBResponse {
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
    this.db.setArtist(newArtist);
    response.code = 200;
    response.data = newArtist;
    return response;
  }

  getAllArtists(): Artist[] {
    return this.db.allArtists();
  }

  getArtist(id: string): DBResponse {
    const response = new DBResponse();
    const valid = validate(id);
    if (!valid) {
      response.code = 400;
      response.message = `Id ${id} is not valid`;
      return response;
    }
    const artist = this.db.getArtist(id);
    if (!artist) {
      response.code = 404;
      response.message = `Artist with id ${id} not found`;
      return response;
    }
    response.data = artist;
    response.code = 200;
    return response;
  }

  removeArtist(id: string): DBResponse {
    const response = this.getArtist(id);
    console.log(id);
    console.log(response);
    if (!response.data) return response;
    this.db.removeArtist(id);
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
    response = this.getArtist(id);
    if (!response.data) {
      return response;
    }
    artist.id = response.data.id;
    this.db.setArtist(artist);
    response.data = this.db.getArtist(artist.id);
    console.log(response);
    return response;
  }
}
