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
  constructor(private db: DataBase) {}

  async create(track: Track): Promise<DBResponse> {
    const response = new DBResponse();
    const validate =
      stringAndExist(track.name) &&
      stringOrNotExist(track.artistId) &&
      stringOrNotExist(track.albumId) &&
      numberAndExist(track.duration);
    if (!validate) {
      response.code = 400;
      return response;
    }
    const newTrack = new Track();
    newTrack.name = track.name;
    newTrack.albumId = track.albumId;
    newTrack.artistId = track.artistId;
    newTrack.duration = track.duration;
    newTrack.id = newUUID();
    await this.db.setTrack(newTrack);
    response.code = 200;
    response.data = newTrack;
    return response;
  }

  async getAllTracks(): Promise<Track[]> {
    return await this.db.allTracks();
  }

  async getTrack(id: string): Promise<DBResponse> {
    const response = new DBResponse();
    const valid = validate(id);
    if (!valid) {
      response.code = 400;
      response.message = `Id ${id} is not valid`;
      return response;
    }
    const track = await this.db.getTrack(id);
    if (!track || !track.id) {
      response.code = 404;
      response.message = `Track with id ${id} not found`;
      return response;
    }
    response.data = track;
    response.code = 200;
    return response;
  }

  async removeTrack(id: string): Promise<DBResponse> {
    const response = await this.getTrack(id);
    if (!response.data) return response;
    await this.db.removeTrack(id);
    return response;
  }

  async changeTrack(id: string, track: Track): Promise<DBResponse> {
    let response = new DBResponse();
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
    response = await this.getTrack(id);
    if (!response.data) return response;
    const dataRS = response.data as Track;
    track.id = dataRS.id;
    await this.db.setTrack(track);
    response.data = await this.db.getTrack(id);
    return response;
  }
}
