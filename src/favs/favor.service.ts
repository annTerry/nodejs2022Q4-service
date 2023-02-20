import { Injectable } from '@nestjs/common';
import { validate } from 'uuid';
import { DataBase } from 'src/db/db.service';
import { FavoritesResponse } from 'src/dto/favs.dto';
import { DBResponse } from '../common/types';
import { TrackService } from 'src/track/track.service';
import { AlbumService } from 'src/album/album.service';
import { ArtistService } from 'src/artist/artist.service';
import { FAVORITE_TYPES } from '../common/const';

@Injectable()
export class FavService {
  constructor(
    private db: DataBase,
    private trackService: TrackService,
    private albumService: AlbumService,
    private artistService: ArtistService,
  ) {}

  async getAllFavs(): Promise<FavoritesResponse> {
    const favResponse = new FavoritesResponse();
    const favTracks = await this.db.getFromFav(FAVORITE_TYPES.track);
    const favAlbums = await this.db.getFromFav(FAVORITE_TYPES.album);
    const favArtists = await this.db.getFromFav(FAVORITE_TYPES.artist);
    favResponse.tracks = await this.trackService.getAllTracks();
    favResponse.tracks = favResponse.tracks.filter(
      (object) => favTracks.indexOf(object.id) > -1,
    );
    favResponse.albums = await this.albumService.getAllAlbums();
    favResponse.albums = favResponse.albums.filter(
      (object) => favAlbums.indexOf(object.id) > -1,
    );
    favResponse.artists = await this.artistService.getAllArtists();
    favResponse.artists = favResponse.artists.filter(
      (object) => favArtists.indexOf(object.id) > -1,
    );
    return favResponse;
  }

  async addTrack(id: string): Promise<DBResponse> {
    const response = await this.trackService.getTrack(id);
    if (response.code === 404) {
      response.code = 422;
      return response;
    }
    this.db.addTrackToFav(id);
    return response;
  }

  async addAlbum(id: string): Promise<DBResponse> {
    const response = await this.albumService.getAlbum(id);
    if (response.code === 404) {
      response.code = 422;
      return response;
    }
    this.db.addAlbumToFav(id);
    return response;
  }

  async addArtist(id: string): Promise<DBResponse> {
    const response = await this.artistService.getArtist(id);
    if (response.code === 404) {
      response.code = 422;
      return response;
    }
    this.db.addArtistToFav(id);
    return response;
  }

  async removeTrack(id: string): Promise<DBResponse> {
    const response = new DBResponse();
    const val = validate(id);
    if (!val) {
      response.code = 400;
      response.message = `Id ${id} is not valid`;
      return response;
    }
    if (!(await this.db.favHasTrack(id))) {
      response.code = 404;
      response.message = `Track is not in Favorites`;
      return response;
    }
    await this.db.removeFromFav(FAVORITE_TYPES.track, id);
    response.code = 204;
    return response;
  }

  async removeAlbum(id: string): Promise<DBResponse> {
    const response = new DBResponse();
    const val = validate(id);
    if (!val) {
      response.code = 400;
      response.message = `Id ${id} is not valid`;
      return response;
    }
    if (!(await this.db.favHasAlbum(id))) {
      response.code = 404;
      response.message = `Album is not in Favorites`;
      return response;
    }
    await this.db.removeFromFav(FAVORITE_TYPES.album, id);
    response.code = 204;
    return response;
  }

  async removeArtist(id: string): Promise<DBResponse> {
    const response = new DBResponse();
    const val = validate(id);
    if (!val) {
      response.code = 400;
      response.message = `Id ${id} is not valid`;
      return response;
    }
    if (!(await this.db.favHasArtist(id))) {
      response.code = 404;
      response.message = `Artist is not in Favorites`;
      return response;
    }
    await this.db.removeFromFav(FAVORITE_TYPES.artist, id);
    response.code = 204;
    return response;
  }
}
