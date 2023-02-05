import {
  Controller,
  Get,
  Param,
  Post,
  Put,
  Delete,
  Body,
  HttpException,
  HttpCode,
} from '@nestjs/common';
import { AlbumService } from './album.service';
import { Album } from 'src/common/types';

@Controller('album')
export class AlbumController {
  albumService = new AlbumService();

  @Get()
  getAllAlbums(): string {
    return JSON.stringify(this.albumService.getAllAlbums());
  }
  @Get(':id')
  getUserById(@Param('id') id: string): string {
    const dbResponse = this.albumService.getAlbum(id);
    if (!dbResponse.data) {
      throw new HttpException(dbResponse.message, dbResponse.code);
    }
    return JSON.stringify(dbResponse.data);
  }
  @Post()
  async create(@Body() album: Album) {
    const result = this.albumService.create(album);
    if (result === 400) throw new HttpException('Data missing', result);
  }
  @Put(':id')
  async edit(@Param('id') id: string, @Body() album: Album) {
    const result = this.albumService.changeAlbum(id, album);
    if (result.code !== 200)
      throw new HttpException(result.message, result.code);
  }
  @Delete(':id')
  @HttpCode(204)
  delUserById(@Param('id') id: string) {
    const result = this.albumService.removeAlbum(id);
    if (result.code !== 200)
      throw new HttpException(result.message, result.code);
  }
}
