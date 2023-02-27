import { User, Album, Artist, Track, ClearUser } from '../common/types';
import {
  User as DBUser,
  Artist as DBArtist,
  Album as DBAlbum,
  Track as DBTrack,
  Favorites as DBFavorite,
} from './db.entities';
import { Injectable } from '@nestjs/common';
import { AppDataSource } from './db.config';
import { FAVORITE_TYPES } from '../common/const';

@Injectable()
export class DataBase {
  private dbUserRepository = AppDataSource.getRepository(DBUser);
  private dbArtistRepository = AppDataSource.getRepository(DBArtist);
  private dbTrackRepository = AppDataSource.getRepository(DBTrack);
  private dbAlbumRepository = AppDataSource.getRepository(DBAlbum);
  private dbFavoriteRepository = AppDataSource.getRepository(DBFavorite);

  private copyObjectByKeys<T, N>(
    inputData: N,
    outputData: T,
    noPassInInput = false,
    requiredFields = [],
  ): T {
    if (inputData) {
      Object.keys(inputData).forEach((key) => {
        if (key !== 'password' || !noPassInInput) {
          outputData[key] = inputData[key];
        }
        if (key === 'createdAt' || key === 'updatedAt') {
          outputData[key] = +inputData[key];
        }
        if (inputData[key] === undefined) {
          outputData[key] = null;
        }
      });
      requiredFields.forEach((key) => {
        if (!outputData[key] && outputData[key] === undefined)
          outputData[key] = null;
        else if (outputData[key]) outputData[key] = outputData[key].id;
      });
    }
    return outputData;
  }

  async getUser(id: string): Promise<User> {
    let user = new User();
    const currentUser = await this.dbUserRepository.findOneBy({
      id: id,
    });
    user = this.copyObjectByKeys(currentUser, user);
    return user;
  }

  async getUserByPassword(login: string, password: string): Promise<User> {
    let user = new User();
    const currentUser = await this.dbUserRepository.findOneBy({
      login: login,
      password: password,
    });
    user = this.copyObjectByKeys(currentUser, user);
    return user;
  }

  async getClearUser(id: string): Promise<ClearUser> {
    let clearUser = new ClearUser();
    const currentUser = await this.dbUserRepository.findOneBy({
      id: id,
    });
    clearUser = this.copyObjectByKeys(currentUser, clearUser, true);
    return clearUser;
  }

  async setUser(user: User) {
    let userModel = new DBUser();
    userModel = this.copyObjectByKeys(user, userModel);
    await AppDataSource.manager.save(userModel);
  }

  async allUsers(): Promise<ClearUser[]> {
    const allUsers = await this.dbUserRepository.find();
    return Object.values(allUsers).map((data) => {
      let value: ClearUser = new ClearUser();
      value = this.copyObjectByKeys(data, value, true);
      return value;
    });
  }

  async removeUser(id: string) {
    const userToRemove = await this.dbUserRepository.findOneBy({
      id: id,
    });
    if (userToRemove) await this.dbUserRepository.remove(userToRemove);
  }

  async getAlbum(id: string): Promise<Album> {
    let album = new Album();
    const currentAlbum = await this.dbAlbumRepository.find({
      where: { id: id },
      relations: { artistId: true },
    });
    if (currentAlbum.length > 0)
      album = this.copyObjectByKeys(currentAlbum[0], album, false, [
        'artistId',
      ]);
    return album;
  }

  async setAlbum(album: Album) {
    let albumModel = new DBAlbum();
    albumModel = this.copyObjectByKeys(album, albumModel);
    if (album.artistId != null) {
      albumModel.artistId = await this.dbArtistRepository.findOneBy({
        id: album.artistId,
      });
    }
    await AppDataSource.manager.save(albumModel);
  }
  async allAlbums(): Promise<Album[]> {
    const allAlbums = await this.dbAlbumRepository.find({
      relations: { artistId: true },
    });
    return allAlbums.map((data) => {
      let value: Album = new Album();
      value = this.copyObjectByKeys(data, value, false, ['artistId']);
      return value;
    });
  }

  async removeAlbum(id: string) {
    const albumToRemove = await this.dbAlbumRepository.findOneBy({
      id: id,
    });
    if (albumToRemove) await this.dbAlbumRepository.remove(albumToRemove);
    await this.removeFromFav(FAVORITE_TYPES.album, id);
  }

  async getArtist(id: string): Promise<Artist> {
    let artist = new Artist();
    const currentArtist = await this.dbArtistRepository.findOneBy({
      id: id,
    });
    artist = this.copyObjectByKeys(currentArtist, artist);
    return artist;
  }
  async setArtist(artist: Artist) {
    let artistModel = new DBArtist();
    artistModel = this.copyObjectByKeys(artist, artistModel);
    await AppDataSource.manager.save(artistModel);
  }
  async allArtists(): Promise<Artist[]> {
    const allArtists = await this.dbArtistRepository.find();
    return allArtists.map((data) => {
      let value: Artist = new Artist();
      value = this.copyObjectByKeys(data, value, true);
      return value;
    });
  }

  async removeArtist(id: string) {
    await this.removeFromFav(FAVORITE_TYPES.artist, id);
    const artistToRemove = await this.dbArtistRepository.findOneBy({
      id: id,
    });
    if (artistToRemove) await this.dbArtistRepository.remove(artistToRemove);
  }

  async getTrack(id: string): Promise<Track> {
    let track = new Track();
    const currentTrack = await this.dbTrackRepository.findOneBy({
      id: id,
    });
    track = this.copyObjectByKeys(currentTrack, track, false, [
      'artistId',
      'albumId',
    ]);
    return track;
  }
  async setTrack(track: Track) {
    let trackModel = new DBTrack();
    trackModel = this.copyObjectByKeys(track, trackModel);
    if (track.artistId != null) {
      trackModel.artistId = await this.dbArtistRepository.findOneBy({
        id: track.artistId,
      });
    }
    if (track.albumId != null) {
      trackModel.albumId = await this.dbAlbumRepository.findOneBy({
        id: track.albumId,
      });
    }
    await AppDataSource.manager.save(trackModel);
  }
  async allTracks(): Promise<Track[]> {
    const allTracks = await this.dbTrackRepository.find({
      relations: { artistId: true, albumId: true },
    });
    return allTracks.map((data) => {
      let value: Track = new Track();
      value = this.copyObjectByKeys(data, value, false, [
        'artistId',
        'albumId',
      ]);
      return value;
    });
  }
  async removeTrack(id: string) {
    this.removeFromFav(FAVORITE_TYPES.track, id);
    const trackToRemove = await this.dbTrackRepository.findOneBy({
      id: id,
    });
    if (trackToRemove) await this.dbTrackRepository.remove(trackToRemove);
  }

  async addTrackToFav(id: string) {
    const favToRemove = await this.dbFavoriteRepository.findOneBy({
      id: id,
    });
    if (favToRemove) await this.dbFavoriteRepository.remove(favToRemove);
    const favModel = new DBFavorite();
    favModel.id = id;
    favModel.type = FAVORITE_TYPES.track;
    await AppDataSource.manager.save(favModel);
  }
  async addArtistToFav(id: string) {
    const favToRemove = await this.dbFavoriteRepository.findOneBy({
      id: id,
    });
    if (favToRemove) await this.dbFavoriteRepository.remove(favToRemove);
    const favModel = new DBFavorite();
    favModel.id = id;
    favModel.type = FAVORITE_TYPES.artist;
    await AppDataSource.manager.save(favModel);
  }
  async addAlbumToFav(id: string) {
    const favToRemove = await this.dbFavoriteRepository.findOneBy({
      id: id,
    });
    if (favToRemove) await this.dbFavoriteRepository.remove(favToRemove);
    const favModel = new DBFavorite();
    favModel.id = id;
    favModel.type = FAVORITE_TYPES.album;
    await AppDataSource.manager.save(favModel);
  }
  async getFromFav(key: string): Promise<string[]> {
    const favsByType = await this.dbFavoriteRepository.findBy({
      type: key,
    });
    return favsByType.map((value) => value.id);
  }
  async removeFromFav(key: string, id: string): Promise<string[]> {
    const result = await this.getFromFav(key);
    const favToRemove = await this.dbFavoriteRepository.findOneBy({
      id: id,
    });
    if (favToRemove) await this.dbFavoriteRepository.remove(favToRemove);
    return result;
  }

  async favHasTrack(id: string): Promise<boolean> {
    const favoriteEntity = await this.dbFavoriteRepository.findOneBy({
      id: id,
    });
    return favoriteEntity && favoriteEntity.type === FAVORITE_TYPES.track;
  }
  async favHasAlbum(id: string): Promise<boolean> {
    const favoriteEntity = await this.dbFavoriteRepository.findOneBy({
      id: id,
    });
    return favoriteEntity && favoriteEntity.type === FAVORITE_TYPES.album;
  }
  async favHasArtist(id: string): Promise<boolean> {
    const favoriteEntity = await this.dbFavoriteRepository.findOneBy({
      id: id,
    });
    return favoriteEntity && favoriteEntity.type === FAVORITE_TYPES.artist;
  }
}
