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
  setUser(user: User) {
    this.users[user.id] = user;
  }
  allUsers(): ClearUser[] {
    return Object.values(this.users).map((data) => {
      const value: ClearUser = {
        id: '',
        login: '',
        version: 0,
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
  getArtist(id: string): Artist | null {
    return this.artist[id];
  }
  setArtist(artist: Artist) {
    this.artist[artist.id] = artist;
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
    delete this.track[id];
  }
  addTrackToFav(id: string) {
    if (this.favs.tracks.indexOf(id) >= 0) {
      this.favs.tracks.push(id);
    }
  }
  addArtistToFav(id: string) {
    if (this.favs.artists.indexOf(id) >= 0) {
      this.favs.artists.push(id);
    }
  }
  addAlbumToFav(id: string) {
    if (this.favs.albums.indexOf(id) >= 0) {
      this.favs.albums.push(id);
    }
  }
}
