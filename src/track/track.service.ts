import { Injectable } from '@nestjs/common';
import { v4 as newUUID, validate } from 'uuid';
import {
  stringAndExist,
  stringOrNotExist,
  numberAndExist,
} from '../common/utility';
import { DataBase } from 'src/db/db.service';
import { Track, DBResponse } from '../common/types';

@Injectable()
export class TrackService {
  db = new DataBase();

  create(track: Track): number {
    const validate =
      stringAndExist(track.name) &&
      stringOrNotExist(track.artistId) &&
      stringOrNotExist(track.albumId) &&
      numberAndExist(track.duration);
    if (!validate) return 400;
    const newTrack = new Track();
    newTrack.name = track.name;
    newTrack.albumId = track.albumId;
    newTrack.artistId = track.artistId;
    newTrack.duration = track.duration;
    newTrack.id = newUUID();
    this.db.setTrack(newTrack);
    return 200;
  }

  getAllTracks(): Track[] {
    return this.db.allTracks();
  }

  getTrack(id: string): DBResponse {
    const response = new DBResponse();
    const valid = validate(id);
    if (!valid) {
      response.code = 400;
      response.message = `Id ${id} is not valid`;
      return response;
    }
    const track = this.db.getTrack(id);
    if (!track) {
      response.code = 404;
      response.message = `Track with id ${id} not found`;
      return response;
    }
    response.code = 200;
    return response;
  }

  removeTrack(id: string): DBResponse {
    const response = this.getTrack(id);
    if (!response.data) return response;
    this.db.removeTrack(id);
    return response;
  }

  changeTrack(id: string, track: Track): DBResponse {
    const response = this.getTrack(id);
    if (!response.data) {
      response.code = 404;
      response.message = `Track with id ${id} not found`;
      return response;
    }
    const validate =
      stringAndExist(track.name) &&
      stringOrNotExist(track.artistId) &&
      stringOrNotExist(track.albumId) &&
      numberAndExist(track.duration);
    if (!validate) {
      response.code = 400;
      response.message = `Wrong data`;
      return response;
    }
    track.id = response.data.id;
    this.db.setTrack(track);
    return response;
  }
}
