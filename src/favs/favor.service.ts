import { Injectable } from '@nestjs/common';
import { validate } from 'uuid';
import { DataBase } from 'src/db/db.service';
import { FavoritesResponse } from 'src/dto/favs.dto';
import { DBResponse } from '../common/types';
import { TrackService } from 'src/track/track.service';
import { AlbumService } from 'src/album/album.service';
import { ArtistService } from 'src/artist/artist.service';

@Injectable()
export class FavService {
  constructor(
    private db: DataBase,
    private trackService: TrackService,
    private albumService: AlbumService,
    private artistService: ArtistService,
  ) {}

  getAllFavs(): FavoritesResponse {
    const favResponse = new FavoritesResponse();
    const favTracks = this.db.getFromFav('tracks');
    const favAlbums = this.db.getFromFav('albums');
    const favArtists = this.db.getFromFav('artists');
    favResponse.tracks = this.trackService
      .getAllTracks()
      .filter((object) => favTracks.indexOf(object.id) > -1);
    favResponse.albums = this.albumService
      .getAllAlbums()
      .filter((object) => favAlbums.indexOf(object.id) > -1);
    favResponse.artists = this.artistService
      .getAllArtists()
      .filter((object) => favArtists.indexOf(object.id) > -1);
    return favResponse;
  }

  addTrack(id: string): DBResponse {
    const response = this.trackService.getTrack(id);
    if (response.code === 404) {
      response.code = 422;
      return response;
    }
    this.db.addTrackToFav(id);
    return response;
  }

  addAlbum(id: string): DBResponse {
    const response = this.albumService.getAlbum(id);
    if (response.code === 404) {
      response.code = 422;
      return response;
    }
    this.db.addAlbumToFav(id);
    return response;
  }

  addArtist(id: string): DBResponse {
    const response = this.artistService.getArtist(id);
    if (response.code === 404) {
      response.code = 422;
      return response;
    }
    this.db.addArtistToFav(id);
    return response;
  }

  removeTrack(id: string): DBResponse {
    const response = new DBResponse();
    const val = validate(id);
    if (!val) {
      response.code = 400;
      response.message = `Id ${id} is not valid`;
      return response;
    }
    if (!this.db.favHasTrack(id)) {
      response.code = 404;
      response.message = `Track is not in Favorites`;
      return response;
    }
    this.db.removeFromFav('tracks', id);
    response.code = 204;
    return response;
  }

  removeAlbum(id: string): DBResponse {
    const response = new DBResponse();
    const val = validate(id);
    if (!val) {
      response.code = 400;
      response.message = `Id ${id} is not valid`;
      return response;
    }
    if (!this.db.favHasAlbum(id)) {
      response.code = 404;
      response.message = `Album is not in Favorites`;
      return response;
    }
    this.db.removeFromFav('albums', id);
    response.code = 204;
    return response;
  }

  removeArtist(id: string): DBResponse {
    const response = new DBResponse();
    const val = validate(id);
    if (!val) {
      response.code = 400;
      response.message = `Id ${id} is not valid`;
      return response;
    }
    if (!this.db.favHasArtist(id)) {
      response.code = 404;
      response.message = `Artist is not in Favorites`;
      return response;
    }
    this.db.removeFromFav('artists', id);
    response.code = 204;
    return response;
  }
}
