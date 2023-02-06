import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserController } from './user/user.controller';
import { UserService } from './user/user.service';
import { TrackController } from './track/track.controller';
import { ArtistController } from './artist/artist.controller';
import { AlbumController } from './album/album.controller';
import { FavsController } from './favs/favs.controller';
import { DataBase } from './db/db.service';
import { TrackService } from './track/track.service';
import { ArtistService } from './artist/artist.service';
import { AlbumService } from './album/album.service';
import { FavService } from './favs/favor.service';

@Module({
  imports: [],
  controllers: [
    AppController,
    UserController,
    TrackController,
    ArtistController,
    AlbumController,
    FavsController,
  ],
  providers: [
    AppService,
    UserService,
    DataBase,
    TrackService,
    ArtistService,
    AlbumService,
    FavService,
  ],
})
export class AppModule {}
