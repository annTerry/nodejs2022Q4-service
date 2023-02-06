import {
  User,
  Album,
  Artist,
  Track,
  Favorites,
  ClearUser,
} from '../common/types';
import { Injectable } from '@nestjs/common';

@Injectable()
export class DataBase {
  private readonly users: { [id: string]: User } = {};
  private readonly albums: { [id: string]: Album } = {};
  private readonly artist: { [id: string]: Artist } = {};
  private readonly track: { [id: string]: Track } = {};
  private readonly favs: Favorites = new Favorites();

  getUser(id: string): User | null {
    return this.users[id];
  }
  getClearUser(id: string): ClearUser {
    const clearUser = new ClearUser();
    const currentUser = this.users[id];
    Object.keys(currentUser).forEach((key) => {
      if (key !== 'password') {
        clearUser[key] = currentUser[key];
      }
    });
    return clearUser;
  }
  setUser(user: User) {
    this.users[user.id] = user;
  }
  allUsers(): ClearUser[] {
    return Object.values(this.users).map((data) => {
      const value: ClearUser = {
        id: '',
        login: '',
        version: 1,
        createdAt: 0,
        updatedAt: 0,
      };
      Object.keys(data).forEach((key) => {
        if (key !== 'password') value[key] = data[key];
      });
      return value;
    });
  }
  removeUser(id: string) {
    delete this.users[id];
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
