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
import { TrackService } from './track.service';
import { Track } from 'src/common/types';

@Controller('track')
export class TrackController {
  constructor(private trackService: TrackService) {}

  @Get()
  getAllTracks(@Res() res: Response): string {
    res.status(HttpStatus.OK).send(this.trackService.getAllTracks());
    return '';
  }
  @Get(':id')
  getTrackById(@Param('id') id: string, @Res() res: Response): string {
    const dbResponse = this.trackService.getTrack(id);
    if (!dbResponse.data) {
      throw new HttpException(dbResponse.message, dbResponse.code);
    }
    res.status(HttpStatus.OK).send(dbResponse.data);
    return '';
  }
  @Post()
  async create(@Body() track: Track, @Res() res: Response) {
    const result = this.trackService.create(track);
    if (result.code === 400)
      throw new HttpException('Data missing', result.code);
    res.status(HttpStatus.CREATED).send(result.data);
  }
  @Put(':id')
  async edit(
    @Param('id') id: string,
    @Body() track: Track,
    @Res() res: Response,
  ) {
    const result = this.trackService.changeTrack(id, track);
    if (result.code !== 200)
      throw new HttpException(result.message, result.code);
    res.status(HttpStatus.OK).send(result.data);
  }
  @Delete(':id')
  @HttpCode(204)
  delUserById(@Param('id') id: string) {
    const result = this.trackService.removeTrack(id);
    if (result.code !== 200)
      throw new HttpException(result.message, result.code);
  }
}
