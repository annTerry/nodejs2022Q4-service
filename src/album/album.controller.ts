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
  Res,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { AlbumService } from './album.service';
import { Album } from 'src/common/types';

@Controller('album')
export class AlbumController {
  constructor(private albumService: AlbumService) {}

  @Get()
  async getAllAlbums(@Res() res: Response): Promise<string> {
    res.status(HttpStatus.OK).send(await this.albumService.getAllAlbums());
    return '';
  }
  @Get(':id')
  async getAlbumById(@Param('id') id: string): Promise<string> {
    const dbResponse = await this.albumService.getAlbum(id);
    if (!dbResponse.data || !dbResponse.data.id) {
      throw new HttpException(dbResponse.message, dbResponse.code);
    }
    return JSON.stringify(dbResponse.data);
  }
  @Post()
  async create(@Body() album: Album, @Res() res: Response) {
    const result = await this.albumService.create(album);
    if (result.code === 400)
      throw new HttpException('Data missing', result.code);
    res.status(HttpStatus.CREATED).send(result.data);
  }
  @Put(':id')
  async edit(
    @Param('id') id: string,
    @Body() album: Album,
    @Res() res: Response,
  ) {
    const result = await this.albumService.changeAlbum(id, album);
    if (result.code !== 200)
      throw new HttpException(result.message, result.code);
    res.status(HttpStatus.OK).send(result.data);
  }
  @Delete(':id')
  @HttpCode(204)
  async delUserById(@Param('id') id: string) {
    const result = await this.albumService.removeAlbum(id);
    if (result.code !== 200)
      throw new HttpException(result.message, result.code);
  }
}
