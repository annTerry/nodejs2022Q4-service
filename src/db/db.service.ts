import {
  User,
  Album,
  Artist,
  Track,
  Favorites,
  ClearUser,
} from '../common/types';
import { User as DBUser } from './db.entities';
import { Injectable } from '@nestjs/common';
import { AppDataSource } from './db.config';

@Injectable()
export class DataBase {
  private readonly users: { [id: string]: User } = {};
  private readonly albums: { [id: string]: Album } = {};
  private readonly artist: { [id: string]: Artist } = {};
  private readonly track: { [id: string]: Track } = {};
  private readonly favs: Favorites = new Favorites();
  private dbRepository = AppDataSource.getRepository(DBUser);

  private copyObjectByKeys<T, N>(
    inputData: N,
    outputData: T,
    noPassInInput = false,
  ): T {
    if (inputData) {
      Object.keys(inputData).forEach((key) => {
        if (key !== 'password' || !noPassInInput) {
          outputData[key] = inputData[key];
        }
        if (key === 'createdAt' || key === 'updatedAt') {
          outputData[key] = +inputData[key];
        }
      });
    }
    return outputData;
  }

  async getUser(id: string): Promise<User> {
    let user = new User();
    const currentUser = await this.dbRepository.findOneBy({
      id: id,
    });
    user = this.copyObjectByKeys(currentUser, user);
    return user;
  }

  async getClearUser(id: string): Promise<ClearUser> {
    let clearUser = new ClearUser();
    const currentUser = await this.dbRepository.findOneBy({
      id: id,
    });
    clearUser = this.copyObjectByKeys(currentUser, clearUser, true);
    return clearUser;
  }

  async setUser(user: User) {
    console.log(JSON.stringify(user));
    let userModel = new DBUser();
    userModel = this.copyObjectByKeys(user, userModel);
    console.log(JSON.stringify(userModel));
    await AppDataSource.manager.save(userModel);
    console.log(user.id);
  }

  async allUsers(): Promise<ClearUser[]> {
    const allUsers = await this.dbRepository.find();
    return Object.values(allUsers).map((data) => {
      let value: ClearUser = new ClearUser();
      value = this.copyObjectByKeys(data, value, true);
      return value;
    });
  }

  async removeUser(id: string) {
    const userToRemove = await this.dbRepository.findOneBy({
      id: id,
    });
    if (userToRemove) await this.dbRepository.remove(userToRemove);
  }

  getAlbum(id: string): Album | null {
    return this.albums[id];
  }
  setAlbum(album: Album) {
    this.albums[album.id] = album;
  }
  allAlbums(): Album[] {
    return Object.values(this.albums);
  }
  removeAlbum(id: string) {
    Object.entries(this.track).forEach(([key, value]) => {
      if (value.albumId === id) {
        this.track[key].albumId = null;
      }
    });
    if (this.favHasAlbum(id)) this.removeFromFav('albums', id);
    delete this.albums[id];
  }
  getArtist(id: string): Artist | null {
    return this.artist[id];
  }
  setArtist(artist: Artist) {
    this.artist[artist.id] = artist;
  }
  allArtists(): Artist[] {
    return Object.values(this.artist);
  }
  removeArtist(id: string) {
    Object.entries(this.track).forEach(([key, value]) => {
      if (value.artistId === id) {
        this.track[key].artistId = null;
      }
    });
    if (this.favHasArtist(id)) this.removeFromFav('artists', id);
    delete this.artist[id];
  }
  getTrack(id: string): Track | null {
    return this.track[id];
  }
  setTrack(track: Track) {
    this.track[track.id] = track;
  }
  allTracks(): Track[] {
    return Object.values(this.track);
  }
  removeTrack(id: string) {
    if (this.favHasTrack(id)) this.removeFromFav('tracks', id);
    delete this.track[id];
  }
  addTrackToFav(id: string) {
    if (!this.favs.tracks) this.favs.tracks = [];
    if (this.favs.tracks.indexOf(id) < 0) {
      this.favs.tracks.push(id);
    }
  }
  addArtistToFav(id: string) {
    if (!this.favs.artists) this.favs.artists = [];
    if (this.favs.artists.indexOf(id) < 0) {
      this.favs.artists.push(id);
    }
  }
  addAlbumToFav(id: string) {
    if (!this.favs.albums) this.favs.albums = [];
    if (this.favs.albums.indexOf(id) < 0) {
      this.favs.albums.push(id);
    }
  }
  getFromFav(key: string): string[] {
    let result = this.favs[key];
    if (!result) result = [];
    return result;
  }
  removeFromFav(key: string, id: string): string[] {
    let result = this.favs[key];
    if (!result) result = [];
    this.favs[key] = result.filter((data: string) => data !== id);
    return result;
  }
  favHasTrack(id: string): boolean {
    return this.favs.tracks && this.favs.tracks.indexOf(id) > -1;
  }
  favHasAlbum(id: string): boolean {
    return this.favs.albums && this.favs.albums.indexOf(id) > -1;
  }
  favHasArtist(id: string): boolean {
    return this.favs.artists && this.favs.artists.indexOf(id) > -1;
  }
}
