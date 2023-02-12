import { Album, Artist, Track } from 'src/common/types';

export class FavoritesResponse {
  artists: Artist[];
  albums: Album[];
  tracks: Track[];
}
