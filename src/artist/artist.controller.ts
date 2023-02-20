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
  async getAllArtists(@Res() res: Response): Promise<string> {
    res.status(HttpStatus.OK).send(await this.artistService.getAllArtists());
    return '';
  }
  @Get(':id')
  async getUserById(@Param('id') id: string): Promise<string> {
    const dbResponse = await this.artistService.getArtist(id);
    if (!dbResponse.data || !dbResponse.data.id) {
      throw new HttpException(dbResponse.message, dbResponse.code);
    }
    return JSON.stringify(dbResponse.data);
  }
  @Post()
  async create(@Body() artist: Artist, @Res() res: Response) {
    const result = await this.artistService.create(artist);
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
  async delUserById(@Param('id') id: string) {
    const result = await this.artistService.removeArtist(id);
    if (result.code !== 200)
      throw new HttpException(result.message, result.code);
  }
}
