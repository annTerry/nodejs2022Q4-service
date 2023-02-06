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
import { ArtistService } from './artist.service';
import { Artist } from 'src/common/types';

@Controller('artist')
export class ArtistController {
  constructor(private artistService: ArtistService) {}

  @Get()
  getAllArtists(@Res() res: Response): string {
    res.status(HttpStatus.OK).send(this.artistService.getAllArtists());
    return '';
  }
  @Get(':id')
  getUserById(@Param('id') id: string): string {
    const dbResponse = this.artistService.getArtist(id);
    if (!dbResponse.data) {
      throw new HttpException(dbResponse.message, dbResponse.code);
    }
    return JSON.stringify(dbResponse.data);
  }
  @Post()
  async create(@Body() artist: Artist, @Res() res: Response) {
    const result = this.artistService.create(artist);
    if (result.code === 400)
      throw new HttpException('Data missing', result.code);
    res.status(HttpStatus.CREATED).send(result.data);
  }
  @Put(':id')
  async edit(
    @Param('id') id: string,
    @Body() artist: Artist,
    @Res() res: Response,
  ) {
    const result = await this.artistService.changeArtist(id, artist);
    if (result.code !== 200)
      throw new HttpException(result.message, result.code);
    res.status(HttpStatus.OK).send(result.data);
  }
  @Delete(':id')
  @HttpCode(204)
  delUserById(@Param('id') id: string) {
    const result = this.artistService.removeArtist(id);
    if (result.code !== 200)
      throw new HttpException(result.message, result.code);
  }
}
