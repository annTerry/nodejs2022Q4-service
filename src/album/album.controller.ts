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
  Req,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { AlbumService } from './album.service';
import { Album } from 'src/common/types';
import { accessCheck } from 'src/common/access';

@Controller('album')
export class AlbumController {
  constructor(private albumService: AlbumService) {}

  @Get()
  async getAllAlbums(
    @Res() res: Response,
    @Req() request: Request,
  ): Promise<string> {
    const auth = accessCheck(request.headers.authorization);
    if (auth.code === 401) {
      throw new HttpException('Not Authorized', auth.code);
    }
    res.status(HttpStatus.OK).send(await this.albumService.getAllAlbums());
    return '';
  }
  @Get(':id')
  async getAlbumById(
    @Param('id') id: string,
    @Req() request: Request,
  ): Promise<string> {
    const auth = accessCheck(request.headers.authorization);
    if (auth.code === 401) {
      throw new HttpException('Not Authorized', auth.code);
    }
    const dbResponse = await this.albumService.getAlbum(id);
    const data = dbResponse.data as Album;
    if (!data || !data.id) {
      throw new HttpException(dbResponse.message, dbResponse.code);
    }
    return JSON.stringify(dbResponse.data);
  }
  @Post()
  async create(
    @Body() album: Album,
    @Res() res: Response,
    @Req() request: Request,
  ) {
    const auth = accessCheck(request.headers.authorization);
    if (auth.code === 401) {
      throw new HttpException('Not Authorized', auth.code);
    }
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
    @Req() request: Request,
  ) {
    const auth = accessCheck(request.headers.authorization);
    if (auth.code === 401) {
      throw new HttpException('Not Authorized', auth.code);
    }
    const result = await this.albumService.changeAlbum(id, album);
    if (result.code !== 200)
      throw new HttpException(result.message, result.code);
    res.status(HttpStatus.OK).send(result.data);
  }
  @Delete(':id')
  @HttpCode(204)
  async delUserById(@Param('id') id: string, @Req() request: Request) {
    const auth = accessCheck(request.headers.authorization);
    if (auth.code === 401) {
      throw new HttpException('Not Authorized', auth.code);
    }
    const result = await this.albumService.removeAlbum(id);
    if (result.code !== 200)
      throw new HttpException(result.message, result.code);
  }
}
