export class User {
  id: string;
  login: string;
  password: string;
  version: number;
  createdAt: number;
  updatedAt: number;
}

export class ClearUser {
  id: string;
  login: string;
  version: number;
  createdAt: number;
  updatedAt: number;
}

export class DBResponse {
  code: number;
  message: string;
  data: ClearUser | Track | Artist | Album | Token;
}

export class Track {
  id: string;
  name: string;
  artistId: string | null;
  albumId: string | null;
  duration: number;
}

export class Token {
  accessToken?: string;
  refreshToken?: string;
}

export class Artist {
  id: string;
  name: string;
  grammy: boolean;
}

export class Album {
  id: string;
  name: string;
  year: number;
  artistId: string | null;
}

export class Favorites {
  artists: string[];
  albums: string[];
  tracks: string[];
}
