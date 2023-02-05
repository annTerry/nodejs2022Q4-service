import { Injectable } from '@nestjs/common';
import { v4 as newUUID, validate } from 'uuid';
import { stringAndExist, booleanAndExist } from '../common/utility';
import { DataBase } from 'src/db/db.service';
import { Artist, Response } from '../common/types';

@Injectable()
export class ArtistService {
  db = new DataBase();

  create(artist: Artist): number {
    const validate =
      stringAndExist(artist.name) && booleanAndExist(artist.grammy);
    if (!validate) return 400;
    const newArtist = new Artist();
    newArtist.name = artist.name;
    newArtist.grammy = artist.grammy;
    newArtist.id = newUUID();
    this.db.setArtist(newArtist);
    return 200;
  }

  getAllArtists(): Artist[] {
    return this.db.allArtists();
  }

  getArtist(id: string): Response {
    const response = new Response();
    const valid = validate(id);
    if (!valid) {
      response.code = 400;
      response.message = `Id ${id} is not valid`;
      return response;
    }
    const Artist = this.db.getArtist(id);
    if (!Artist) {
      response.code = 404;
      response.message = `Artist with id ${id} not found`;
      return response;
    }
    response.code = 200;
    return response;
  }

  removeArtist(id: string): Response {
    const response = this.getArtist(id);
    if (!response.data) return response;
    this.db.removeArtist(id);
    return response;
  }

  changeArtist(id: string, artist: Artist): Response {
    const response = this.getArtist(id);
    if (!response.data) {
      response.code = 404;
      response.message = `Artist with id ${id} not found`;
      return response;
    }
    const validate =
      stringAndExist(artist.name) && booleanAndExist(artist.grammy);
    if (!validate) {
      response.code = 400;
      response.message = `Wrong data`;
      return response;
    }
    artist.id = response.data.id;
    this.db.setArtist(artist);
    return response;
  }
}
